import React, { useState } from 'react'

import { LoanPosition } from '../../model/loan-position'
import CurrencyAmountInput from '../currency-amount-input'
import { useCurrencyContext } from '../../contexts/currency-context'

import Modal from './modal'

const EditCollateralModal = ({
  position,
  onClose,
}: {
  position: LoanPosition
  onClose: () => void
}) => {
  const { prices } = useCurrencyContext()
  const [value, setValue] = useState('')
  const [isWithdrawCollateral, setIsWithdrawCollateral] = useState(false)
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
          currency={position.underlying}
          value={value}
          onValueChange={setValue}
          price={prices[position.underlying.address]}
          balance={123123123123123123n}
        />
      </div>
      <div className="flex text-sm gap-3 mb-8">
        <span className="text-gray-500">LTV</span>
        1.00
      </div>
      <button
        disabled={true}
        className="font-bold text-xl disabled:bg-gray-100 dark:disabled:bg-gray-800 h-16 rounded-lg disabled:text-gray-300 dark:disabled:text-gray-500"
      >
        Confirm
      </button>
    </Modal>
  )
}

export default EditCollateralModal
