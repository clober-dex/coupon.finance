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
  maxLoanableAmount,
  currentLtv,
  expectedLtv,
  interest,
  actionButton,
  debtAssetPrice,
}: {
  position: LoanPosition
  onClose: () => void
  value: string
  setValue: (value: string) => void
  maxLoanableAmount: bigint
  currentLtv: number
  expectedLtv: number
  interest: bigint
  actionButton: React.ReactNode
  debtAssetPrice?: BigDecimal
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
          price={debtAssetPrice}
          availableAmount={maxLoanableAmount}
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
              debtAssetPrice,
            )}{' '}
            {position.underlying.symbol}
          </div>
        </div>
      </div>
      {actionButton}
    </Modal>
  )
}

export default BorrowMoreModal
