import React from 'react'

import { BigDecimal, formatUnits } from '../../utils/numbers'
import CurrencyAmountInput from '../input/currency-amount-input'
import { Arrow } from '../svg/arrow'
import { ActionButton, ActionButtonProps } from '../button/action-button'
import { Currency } from '../../model/currency'
import { getLTVTextColor } from '../../utils/ltv'
import { Collateral } from '../../model/collateral'

import Modal from './modal'

const BorrowMoreModal = ({
  debtCurrency,
  collateral,
  onClose,
  value,
  setValue,
  maxLoanableAmount,
  currentLtv,
  expectedLtv,
  interest,
  actionButtonProps,
  debtAssetPrice,
}: {
  debtCurrency: Currency
  collateral: Collateral
  onClose: () => void
  value: string
  setValue: (value: string) => void
  maxLoanableAmount: bigint
  currentLtv: number
  expectedLtv: number
  interest: bigint
  actionButtonProps: ActionButtonProps
  debtAssetPrice?: BigDecimal
}) => {
  return (
    <Modal show onClose={onClose}>
      <h1 className="font-bold text-sm sm:text-xl mb-4 sm:mb-6">
        How much would you like to borrow?
      </h1>
      <div className="mb-4">
        <CurrencyAmountInput
          currency={debtCurrency}
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
            <span className={`${getLTVTextColor(currentLtv, collateral)}`}>
              {currentLtv.toFixed(2)}%
            </span>
            {value ? (
              <>
                <Arrow />
                <span className={`${getLTVTextColor(expectedLtv, collateral)}`}>
                  {expectedLtv.toFixed(2)}%
                </span>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex gap-3 justify-between sm:justify-start">
          <div className="text-gray-500">Coupon Purchase Fee</div>
          <div>
            {formatUnits(interest, debtCurrency.decimals, debtAssetPrice)}{' '}
            {debtCurrency.symbol}
          </div>
        </div>
      </div>
      <ActionButton {...actionButtonProps} />
    </Modal>
  )
}

export default BorrowMoreModal
