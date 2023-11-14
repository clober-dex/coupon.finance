import React from 'react'

import CurrencyAmountInput from '../input/currency-amount-input'
import Modal from '../../components/modal/modal'
import { BigDecimal } from '../../utils/numbers'
import { ActionButton, ActionButtonProps } from '../button/action-button'
import { Collateral } from '../../model/collateral'
import { Arrow } from '../svg/arrow'
import { getLTVTextColor } from '../../utils/ltv'

const EditCollateralModal = ({
  collateral,
  onClose,
  value,
  setValue,
  isWithdrawCollateral,
  setIsWithdrawCollateral,
  availableCollateralAmount,
  currentLtv,
  expectedLtv,
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
  expectedLtv: number
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
      <ActionButton {...actionButtonProps} />
    </Modal>
  )
}

export default EditCollateralModal
