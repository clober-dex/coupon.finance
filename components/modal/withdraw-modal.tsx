import React from 'react'

import CurrencyAmountInput from '../input/currency-amount-input'
import Modal from '../../components/modal/modal'
import { BigDecimal, formatUnits } from '../../utils/numbers'
import { ActionButton, ActionButtonProps } from '../button/action-button'
import { Currency } from '../../model/currency'
import { ArrowSvg } from '../svg/arrow-svg'
import { max } from '../../utils/bigint'

const WithdrawModal = ({
  depositCurrency,
  depositedAmount,
  withdrawAmount,
  onClose,
  value,
  setValue,
  maxWithdrawAmount,
  repurchaseFee,
  actionButtonProps,
  depositAssetPrice,
}: {
  depositCurrency: Currency
  depositedAmount: bigint
  withdrawAmount: bigint
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
        <div className="flex items-center gap-1">
          {formatUnits(
            depositedAmount,
            depositCurrency.decimals,
            depositAssetPrice,
          )}{' '}
          {depositCurrency.symbol}
          {value ? (
            <>
              <ArrowSvg />
              <span>
                {formatUnits(
                  max(depositedAmount - withdrawAmount - repurchaseFee, 0n),
                  depositCurrency.decimals,
                  depositAssetPrice,
                )}{' '}
                {depositCurrency.symbol}
              </span>
            </>
          ) : (
            <></>
          )}
        </div>
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
