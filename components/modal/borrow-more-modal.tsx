import React from 'react'

import { formatUnits } from '../../utils/numbers'
import { LoanPosition } from '../../model/loan-position'
import CurrencyAmountInput from '../currency-amount-input'
import { Arrow } from '../svg/arrow'
import { Prices } from '../../model/prices'

import Modal from './modal'

const BorrowMoreModal = ({
  position,
  onClose,
  currencyInputValue,
  setCurrencyInputValue,
  prices,
  maxLoanableAmount,
  currentLtv,
  expectedLtv,
  interest,
  borrowMoreAmount,
  available,
  maxInterest,
  maxLoanableAmountExcludingCouponFee,
  borrowMore,
}: {
  position: LoanPosition
  onClose: () => void
  currencyInputValue: string
  setCurrencyInputValue: (value: string) => void
  prices: Prices
  maxLoanableAmount: bigint
  currentLtv: number
  expectedLtv: number
  interest: bigint
  borrowMoreAmount: bigint
  available: bigint
  maxInterest: bigint
  maxLoanableAmountExcludingCouponFee: bigint
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
          value={currencyInputValue}
          onValueChange={setCurrencyInputValue}
          price={prices[position.underlying.address]}
          availableAmount={maxLoanableAmount}
        />
      </div>
      <div className="flex flex-col mb-6 sm:mb-8 gap-2 sm:gap-3 text-xs sm:text-sm">
        <div className="flex gap-3 justify-between sm:justify-start">
          <div className="text-gray-500">LTV</div>
          <div className="flex items-center gap-1">
            <span className="text-green-500">{currentLtv.toFixed(2)}%</span>
            {currencyInputValue ? (
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
          borrowMoreAmount === 0n ||
          borrowMoreAmount + (position.amount - position.interest) >
            available ||
          borrowMoreAmount +
            (position.amount - position.interest) +
            maxInterest >
            maxLoanableAmountExcludingCouponFee
        }
        className="font-bold text-base sm:text-xl bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
        onClick={async () => {
          await borrowMore(position, borrowMoreAmount, interest)
          setCurrencyInputValue('')
          onClose()
        }}
      >
        {borrowMoreAmount === 0n
          ? 'Enter loan amount'
          : borrowMoreAmount + (position.amount - position.interest) > available
          ? 'Not enough coupons for sale'
          : borrowMoreAmount +
              (position.amount - position.interest) +
              maxInterest >
            maxLoanableAmountExcludingCouponFee
          ? 'Not enough collateral'
          : 'Borrow'}
      </button>
    </Modal>
  )
}

export default BorrowMoreModal
