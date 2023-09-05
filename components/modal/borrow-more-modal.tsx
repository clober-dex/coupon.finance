import React, { SVGProps, useMemo, useState } from 'react'
import { useQuery } from 'wagmi'
import { isAddressEqual, parseUnits } from 'viem'

import { LoanPosition } from '../../model/loan-position'
import { useCurrencyContext } from '../../contexts/currency-context'
import CurrencyAmountInput from '../currency-amount-input'
import { fetchMarkets } from '../../api/market'
import { calculateCouponsToBorrow } from '../../model/market'
import { LIQUIDATION_TARGET_LTV_PRECISION, min } from '../../utils/bigint'
import { dollarValue, formatUnits } from '../../utils/numbers'

import Modal from './modal'

const Arrow = (props: SVGProps<any>) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.875 6L9.75 6"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
    <path
      d="M6.75 9.375L10.125 6L6.75 2.625"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
  </svg>
)

const BorrowMoreModal = ({
  position,
  onClose,
}: {
  position: LoanPosition
  onClose: () => void
}) => {
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
      if (!position) {
        return {
          maxInterest: 0n,
          interest: 0n,
          available: 0n,
        }
      }
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
        position.amount,
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
    return min(
      maxLoanAmountExcludingCouponFee - position.amount,
      data?.available ?? 0n,
    )
  }, [data?.available, maxLoanAmountExcludingCouponFee, position.amount])

  const ltv = useMemo(() => {
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
    <Modal show={!!position} onClose={onClose}>
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
            <span className="text-green-500">{position.ltv.toFixed(2)}%</span>
            {value ? (
              <>
                <Arrow />
                <span className="text-red-500">{ltv.toFixed(2)}%</span>
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
          position.collateralAmount === 0n ||
          amount === 0n ||
          amount > available ||
          amount + maxInterest > maxLoanAmountExcludingCouponFee
        }
        className="font-bold text-base sm:text-xl bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
        onClick={async () => {
          console.log('borrowing')
        }}
      >
        {amount === 0n
          ? 'Enter loan amount'
          : amount > available
          ? 'Not enough coupons for sale'
          : amount + maxInterest > maxLoanAmountExcludingCouponFee
          ? 'Not enough collateral'
          : 'Borrow'}
      </button>
    </Modal>
  )
}

export default BorrowMoreModal
