import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { isAddressEqual, parseUnits } from 'viem'

import { LoanPosition } from '../../model/loan-position'
import { useCurrencyContext } from '../../contexts/currency-context'
import CurrencyAmountInput from '../currency-amount-input'
import { fetchMarkets } from '../../api/market'
import { calculateCouponsToBorrow } from '../../model/market'
import { LIQUIDATION_TARGET_LTV_PRECISION, max, min } from '../../utils/bigint'
import { dollarValue, formatUnits } from '../../utils/numbers'
import { useBorrowContext } from '../../contexts/borrow-context'
import { Arrow } from '../svg/arrow'

import Modal from './modal'

const BorrowMoreModal = ({
  position,
  onClose,
}: {
  position: LoanPosition
  onClose: () => void
}) => {
  const { borrowMore } = useBorrowContext()
  const { prices } = useCurrencyContext()
  const [value, setValue] = useState('')

  const amount = useMemo(
    () => (position ? parseUnits(value, position.underlying.decimals) : 0n),
    [position, value],
  )

  const maxLoanAmountExcludingCouponFee = useMemo(() => {
    const collateralPrice =
      prices[position.collateral.underlying.address]?.value ?? 0n
    const collateralComplement =
      10n ** BigInt(18 - position.collateral.underlying.decimals)
    const loanPrice = prices[position.underlying.address]?.value ?? 0n
    const loanComplement = 10n ** BigInt(18 - position.underlying.decimals)

    return loanPrice && collateralPrice
      ? (position.collateralAmount *
          BigInt(position.collateral.liquidationTargetLtv) *
          collateralPrice *
          collateralComplement) /
          (LIQUIDATION_TARGET_LTV_PRECISION * loanPrice * loanComplement)
      : 0n
  }, [position, prices])

  const { data } = useQuery(
    ['coupon-repurchase-fee-to-borrow', position.underlying.address, amount],
    async () => {
      const markets = (await fetchMarkets())
        .filter((market) =>
          isAddressEqual(
            market.quoteToken.address,
            position.substitute.address,
          ),
        )
        .filter((market) => market.epoch <= position.toEpoch.id)
      return calculateCouponsToBorrow(
        position.substitute,
        markets,
        maxLoanAmountExcludingCouponFee,
        amount,
      )
    },
    {
      keepPreviousData: true,
    },
  )

  const maxInterest = useMemo(() => data?.maxInterest ?? 0n, [data])
  const interest = useMemo(() => data?.interest ?? 0n, [data])
  const available = useMemo(() => data?.available ?? 0n, [data])
  const maxLoanAmount = useMemo(() => {
    return max(
      min(
        maxLoanAmountExcludingCouponFee - (data?.maxInterest ?? 0n),
        data?.available ?? 0n,
      ) - position.amount,
      0n,
    )
  }, [data, maxLoanAmountExcludingCouponFee, position.amount])

  const currentLtv = useMemo(
    () =>
      dollarValue(
        position.amount,
        position.underlying.decimals,
        prices[position.underlying.address],
      )
        .times(100)
        .div(
          dollarValue(
            position.collateralAmount,
            position.collateral.underlying.decimals,
            prices[position.collateral.underlying.address],
          ),
        ),
    [position, prices],
  )

  const expectedLtv = useMemo(() => {
    const collateralDollarValue = dollarValue(
      position.collateralAmount,
      position.collateral.underlying.decimals,
      prices[position.collateral.underlying.address],
    )
    const loanDollarValue = dollarValue(
      position.amount + amount + interest,
      position.underlying.decimals,
      prices[position.underlying.address],
    )
    return loanDollarValue.times(100).div(collateralDollarValue).toNumber()
  }, [position, amount, interest, prices])

  return (
    <Modal show onClose={onClose}>
      <h1 className="font-bold text-sm sm:text-xl mb-4 sm:mb-6">
        How much would you like to borrow?
      </h1>
      <div className="mb-4">
        <CurrencyAmountInput
          currency={position.underlying}
          value={value}
          onValueChange={setValue}
          price={prices[position.underlying.address]}
          balance={maxLoanAmount}
        />
      </div>
      <div className="flex flex-col mb-6 sm:mb-8 gap-2 sm:gap-3 text-xs sm:text-sm">
        <div className="flex gap-3 justify-between sm:justify-start">
          <div className="text-gray-500">LTV</div>
          <div className="flex items-center gap-1">
            <span className="text-green-500">{currentLtv.toFixed(2)}%</span>
            {value ? (
              <>
                <Arrow />
                <span className="text-red-500">{expectedLtv.toFixed(2)}%</span>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex gap-3 justify-between sm:justify-start">
          <div className="text-gray-500">Coupon Purchase Fee</div>
          <div>
            {formatUnits(
              interest,
              position.underlying.decimals,
              prices[position.underlying.address],
            )}{' '}
            {position.underlying.symbol}
          </div>
        </div>
      </div>
      <button
        disabled={
          amount === 0n ||
          amount + position.amount > available ||
          amount + maxInterest + position.amount >
            maxLoanAmountExcludingCouponFee
        }
        className="font-bold text-base sm:text-xl bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
        onClick={async () => {
          await borrowMore(position, amount, interest)
          setValue('')
          onClose()
        }}
      >
        {amount === 0n
          ? 'Enter loan amount'
          : amount + position.amount > available
          ? 'Not enough coupons for sale'
          : amount + maxInterest + position.amount >
            maxLoanAmountExcludingCouponFee
          ? 'Not enough collateral'
          : 'Borrow'}
      </button>
    </Modal>
  )
}

export default BorrowMoreModal
