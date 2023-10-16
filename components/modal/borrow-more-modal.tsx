import React from 'react'

import { BigDecimal, formatUnits } from '../../utils/numbers'
import { LoanPosition } from '../../model/loan-position'
import CurrencyAmountInput from '../currency-amount-input'
import { Arrow } from '../svg/arrow'

import Modal from './modal'

const BorrowMoreModal = ({
  position,
  onClose,
  value,
  setValue,
  prices,
  maxLoanAmount,
  currentLtv,
  expectedLtv,
  interest,
  amount,
  available,
  maxInterest,
  maxLoanAmountExcludingCouponFee,
  borrowMore,
}: {
  position: LoanPosition
  onClose: () => void
  value: string
  setValue: (value: string) => void
  prices: { [key in `0x${string}`]: BigDecimal }
  maxLoanAmount: bigint
  currentLtv: number
  expectedLtv: number
  interest: bigint
  amount: bigint
  available: bigint
  maxInterest: bigint
  maxLoanAmountExcludingCouponFee: bigint
  borrowMore: (
    position: LoanPosition,
    amount: bigint,
    expectedInterest: bigint,
  ) => Promise<void>
}) => {
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
