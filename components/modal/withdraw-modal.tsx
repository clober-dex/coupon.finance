import React from 'react'

import CurrencyAmountInput from '../input/currency-amount-input'
import Modal from '../../components/modal/modal'
import { BigDecimal, formatUnits } from '../../utils/numbers'
import { ActionButton, ActionButtonProps } from '../button/action-button'
import { Currency } from '../../model/currency'

const WithdrawModal = ({
  depositCurrency,
  depositAmount,
  onClose,
  value,
  setValue,
  maxWithdrawAmount,
  repurchaseFee,
  actionButtonProps,
  depositAssetPrice,
}: {
  depositCurrency: Currency
  depositAmount: bigint
  onClose: () => void
  value: string
  setValue: (value: string) => void
  maxWithdrawAmount: bigint
  repurchaseFee: bigint
  actionButtonProps: ActionButtonProps
  depositAssetPrice?: BigDecimal
}) => {
  return (
    <Modal
      show
      onClose={() => {
        setValue('')
        onClose()
      }}
    >
      <h1 className="font-bold text-sm sm:text-xl mb-4 sm:mb-6">
        How much would you like to withdraw?
      </h1>
      <div className="mb-4">
        <CurrencyAmountInput
          currency={depositCurrency}
          value={value}
          onValueChange={setValue}
          availableAmount={maxWithdrawAmount}
          price={depositAssetPrice}
        />
      </div>
      <div className="flex text-xs sm:text-sm gap-3 mb-2 sm:mb-3 justify-between sm:justify-start">
        <span className="text-gray-500">Your deposit amount</span>
        {formatUnits(
          depositAmount,
          depositCurrency.decimals,
          depositAssetPrice,
        )}{' '}
        {depositCurrency.symbol}
      </div>
      <div className="flex text-xs sm:text-sm gap-3 mb-6 sm:mb-8 justify-between sm:justify-start">
        <span className="text-gray-500">Coupon repurchase fee</span>
        {formatUnits(
          repurchaseFee,
          depositCurrency.decimals,
          depositAssetPrice,
        )}{' '}
        {depositCurrency.symbol}
      </div>
      <ActionButton {...actionButtonProps} />
    </Modal>
  )
}

export default WithdrawModal
