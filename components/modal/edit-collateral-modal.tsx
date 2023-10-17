import React from 'react'

import { LoanPosition } from '../../model/loan-position'
import CurrencyAmountInput from '../../components/currency-amount-input'
import { BigDecimal } from '../../utils/numbers'
import Modal from '../../components/modal/modal'

const EditCollateralModal = ({
  position,
  onClose,
  addCollateral,
  removeCollateral,
  prices,
  value,
  setValue,
  isWithdrawCollateral,
  setIsWithdrawCollateral,
  amount,
  availableCollateralAmount,
  currentLtv,
}: {
  position: LoanPosition
  onClose: () => void
  addCollateral: (position: LoanPosition, amount: bigint) => Promise<void>
  removeCollateral: (position: LoanPosition, amount: bigint) => Promise<void>
  prices: { [key in `0x${string}`]: BigDecimal }
  value: string
  setValue: (value: string) => void
  isWithdrawCollateral: boolean
  setIsWithdrawCollateral: (value: boolean) => void
  amount: bigint
  availableCollateralAmount: bigint
  currentLtv: number
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
          currency={position.collateral.underlying}
          value={value}
          onValueChange={setValue}
          price={prices[position.collateral.underlying.address]}
          balance={availableCollateralAmount}
        />
      </div>
      <div className="flex text-sm gap-3 mb-8">
        <span className="text-gray-500">LTV</span>
        {currentLtv.toFixed(2)}%
      </div>
      <button
        disabled={amount === 0n || amount > availableCollateralAmount}
        className="font-bold text-base sm:text-xl bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
        onClick={async () => {
          isWithdrawCollateral
            ? await removeCollateral(position, amount)
            : await addCollateral(position, amount)
          setValue('')
          onClose()
        }}
      >
        {amount === 0n
          ? 'Enter collateral amount'
          : !isWithdrawCollateral && amount > availableCollateralAmount
          ? `Insufficient ${position.collateral.underlying.symbol} balance`
          : isWithdrawCollateral && amount > position.collateralAmount
          ? 'Not enough collateral'
          : 'Confirm'}
      </button>
    </Modal>
  )
}

export default EditCollateralModal
