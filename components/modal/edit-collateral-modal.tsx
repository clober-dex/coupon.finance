import React from 'react'

import CurrencyAmountInput from '../../components/currency-amount-input'
import Modal from '../../components/modal/modal'
import { BigDecimal } from '../../utils/numbers'
import { ActionButton, ActionButtonProps } from '../action-button'
import { Collateral } from '../../model/collateral'

const EditCollateralModal = ({
  collateral,
  onClose,
  value,
  setValue,
  isWithdrawCollateral,
  setIsWithdrawCollateral,
  availableCollateralAmount,
  currentLtv,
  actionButtonProps,
  collateralPrice,
}: {
  collateral: Collateral
  onClose: () => void
  value: string
  setValue: (value: string) => void
  isWithdrawCollateral: boolean
  setIsWithdrawCollateral: (value: boolean) => void
  availableCollateralAmount: bigint
  currentLtv: number
  actionButtonProps: ActionButtonProps
  collateralPrice?: BigDecimal
}) => {
  return (
    <Modal show onClose={onClose}>
      <h1 className="font-bold text-xl mb-6">Add or withdraw collateral</h1>
      <div className="flex mb-6 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-500">
        <button
          className="flex-1 py-2 rounded border-gray-100 dark:border-gray-800 disabled:border-green-500 dark:disabled:border-green-500 disabled:text-green-500 border-[1.5px]"
          disabled={!isWithdrawCollateral}
          onClick={() => setIsWithdrawCollateral(false)}
        >
          Add Collateral
        </button>
        <button
          className="flex-1 py-2 rounded border-gray-100 dark:border-gray-800 disabled:border-green-500 dark:disabled:border-green-500 disabled:text-green-500 border-[1.5px]"
          disabled={isWithdrawCollateral}
          onClick={() => setIsWithdrawCollateral(true)}
        >
          Withdraw Collateral
        </button>
      </div>
      <div className="mb-4">
        <CurrencyAmountInput
          currency={collateral.underlying}
          value={value}
          onValueChange={setValue}
          price={collateralPrice}
          availableAmount={availableCollateralAmount}
        />
      </div>
      <div className="flex text-sm gap-3 mb-8">
        <span className="text-gray-500">LTV</span>
        {currentLtv.toFixed(2)}%
      </div>
      <ActionButton {...actionButtonProps} />
    </Modal>
  )
}

export default EditCollateralModal
