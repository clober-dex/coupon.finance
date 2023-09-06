import React, { useState } from 'react'

import { LoanPosition } from '../../model/loan-position'
import CurrencyAmountInput from '../currency-amount-input'
import { useCurrencyContext } from '../../contexts/currency-context'

import Modal from './modal'

const RepayModal = ({
  position,
  onClose,
}: {
  position: LoanPosition
  onClose: () => void
}) => {
  const { prices } = useCurrencyContext()
  const [isUseCollateral, setIsUseCollateral] = useState(false)
  const [value, setValue] = useState('')
  return (
    <Modal show={!!position} onClose={onClose}>
      <h1 className="font-bold text-sm sm:text-xl mb-4 sm:mb-6">Repay</h1>
      <div className="flex mb-6 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-500">
        <button
          className="flex-1 py-2 rounded border-gray-100 dark:border-gray-800 disabled:bg-white dark:disabled:bg-gray-800 disabled:border-green-500 dark:disabled:border-green-500 disabled:text-green-500 border-[1.5px]"
          disabled={!isUseCollateral}
          onClick={() => setIsUseCollateral(false)}
        >
          Repay with <br className="flex sm:hidden" /> Wallet Balance
        </button>
        <button
          className="flex-1 py-2 rounded border-gray-100 dark:border-gray-800 disabled:bg-white dark:disabled:bg-gray-800 disabled:border-green-500 dark:disabled:border-green-500 disabled:text-green-500 border-[1.5px]"
          disabled={isUseCollateral}
          onClick={() => setIsUseCollateral(true)}
        >
          Repay with <br className="flex sm:hidden" /> Collateral
        </button>
      </div>
      <div className="mb-4 font-bold">How much would you like to repay?</div>
      <div className="mb-6">
        <CurrencyAmountInput
          currency={position.underlying}
          value={value}
          onValueChange={setValue}
          price={prices[position.underlying.address]}
          balance={123123123123123123n}
        />{' '}
      </div>
      <div className="font-bold mb-3">Transaction Overview</div>
      <div className="flex flex-col gap-2 text-gray-500 text-sm mb-8">
        <div>Remaining Debt</div>
        <div>LTV</div>
      </div>
      <button
        disabled={true}
        className="font-bold text-base sm:text-xl disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg disabled:text-gray-300 dark:disabled:text-gray-500"
      >
        Confirm
      </button>
    </Modal>
  )
}

export default RepayModal
