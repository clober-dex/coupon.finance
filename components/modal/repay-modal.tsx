import React, { useMemo, useState } from 'react'
import { useQuery } from 'wagmi'
import { isAddressEqual, parseUnits } from 'viem'

import { LoanPosition } from '../../model/loan-position'
import CurrencyAmountInput from '../currency-amount-input'
import { useCurrencyContext } from '../../contexts/currency-context'
import { dollarValue, formatUnits } from '../../utils/numbers'
import { Arrow } from '../arrow'
import { fetchMarkets } from '../../api/market'
import { calculateCouponsToRepay } from '../../model/market'
import { min } from '../../utils/bigint'
import { useBorrowContext } from '../../contexts/borrow-context'

import Modal from './modal'

const RepayModal = ({
  position,
  onClose,
}: {
  position: LoanPosition
  onClose: () => void
}) => {
  const { repay } = useBorrowContext()
  const { prices, balances } = useCurrencyContext()
  const [isUseCollateral, setIsUseCollateral] = useState(false)
  const [value, setValue] = useState('')

  const amount = useMemo(
    () => (position ? parseUnits(value, position.underlying.decimals) : 0n),
    [position, value],
  )

  const { data } = useQuery(
    ['coupon-refundable-amount-to-repoy', position.underlying.address, amount],
    async () => {
      const market = (await fetchMarkets())
        .filter((market) =>
          isAddressEqual(
            market.quoteToken.address,
            position.substitute.address,
          ),
        )
        .filter((market) => market.epoch === position.toEpoch.id)[0]
      return calculateCouponsToRepay(position.substitute, market, amount)
    },
    {
      keepPreviousData: true,
    },
  )

  const refund = useMemo(() => data?.refund ?? 0n, [data])
  const available = useMemo(() => data?.available ?? 0n, [data])

  const ltv = useMemo(() => {
    const collateralDollarValue = dollarValue(
      position.collateralAmount,
      position.collateral.underlying.decimals,
      prices[position.collateral.underlying.address],
    )
    const loanDollarValue = dollarValue(
      position.amount - amount,
      position.underlying.decimals,
      prices[position.underlying.address],
    )
    return Math.max(
      loanDollarValue.times(100).div(collateralDollarValue).toNumber(),
      0,
    )
  }, [position, amount, prices])

  return (
    <Modal show onClose={onClose}>
      <h1 className="font-bold text-sm sm:text-xl mb-4 sm:mb-6">Repay</h1>
      <div className="flex mb-6 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-500">
        <button
          className="flex-1 py-2 rounded border-gray-100 dark:border-gray-800 disabled:bg-white dark:disabled:bg-gray-800 disabled:border-green-500 dark:disabled:border-green-500 disabled:text-green-500 border-[1.5px]"
          disabled={!isUseCollateral}
          onClick={() => setIsUseCollateral(false)}
        >
          Repay with <br className="flex sm:hidden" /> Wallet Balance
        </button>
        <button
          className="flex-1 py-2 rounded border-gray-100 dark:border-gray-800 disabled:bg-white dark:disabled:bg-gray-800 disabled:border-green-500 dark:disabled:border-green-500 disabled:text-green-500 border-[1.5px]"
          disabled={isUseCollateral}
          onClick={() => setIsUseCollateral(true)}
        >
          Repay with <br className="flex sm:hidden" /> Collateral
        </button>
      </div>
      <div className="mb-4 font-bold">How much would you like to repay?</div>
      <div className="mb-6">
        <CurrencyAmountInput
          currency={position.underlying}
          value={value}
          onValueChange={setValue}
          price={prices[position.underlying.address]}
          balance={min(
            position.amount,
            available,
            balances[position.underlying.address],
          )}
        />{' '}
      </div>
      <div className="font-bold mb-3">Transaction Overview</div>
      <div className="flex flex-col gap-2 text-gray-500 text-sm mb-8">
        <div className="flex gap-3 justify-between sm:justify-start">
          <div className="text-gray-500">Remaining Debt</div>
          <div>
            {formatUnits(
              position.amount,
              position.underlying.decimals,
              prices[position.underlying.address],
            )}{' '}
            {position.underlying.symbol}
          </div>
        </div>
        <div className="flex gap-3 justify-between sm:justify-start">
          <div className="text-gray-500">LTV</div>
          <div className="flex items-center gap-1">
            <span className="text-green-500">{position.ltv.toFixed(2)}%</span>
            {value ? (
              <>
                <Arrow />
                <span className="text-green-500">{ltv.toFixed(2)}%</span>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <button
        disabled={
          amount === 0n ||
          amount > available ||
          amount > position.amount ||
          amount > balances[position.underlying.address]
        }
        className="font-bold text-base sm:text-xl bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
        onClick={async () => {
          await repay(position, amount, refund)
          setValue('')
          onClose()
        }}
      >
        {amount === 0n
          ? 'Enter repay amount'
          : amount > available
          ? 'Not enough coupons for sale'
          : amount > position.amount
          ? 'Repay amount exceeds debt'
          : amount > balances[position.underlying.address]
          ? `Insufficient ${position.underlying.symbol} balance`
          : 'Repay'}
      </button>
    </Modal>
  )
}

export default RepayModal
