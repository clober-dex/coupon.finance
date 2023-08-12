import React, { useState } from 'react'

import { Currency } from '../../utils/currency'
import NumberInput from '../number-input'

import Modal from './modal'

const RepayModal = ({
  position,
  onClose,
}: {
  position: {
    currency: Currency
    amount: string
  } | null
  onClose: () => void
}) => {
  const [isUseCollateral, setIsUseCollateral] = useState(false)
  const [value, setValue] = useState('')
  return (
    <Modal show={!!position} onClose={onClose}>
      <h1 className="font-bold text-xl mb-6">Repay</h1>
      <div className="flex mb-6 rounded text-xs bg-gray-100 text-gray-500">
        <button
          className="flex-1 py-2 rounded border-gray-100 disabled:border-green-500 disabled:text-green-500 border-[1.5px]"
          disabled={!isUseCollateral}
          onClick={() => setIsUseCollateral(false)}
        >
          Repay with Wallet Balance
        </button>
        <button
          className="flex-1 py-2 rounded border-gray-100 disabled:border-green-500 disabled:text-green-500 border-[1.5px]"
          disabled={isUseCollateral}
          onClick={() => setIsUseCollateral(true)}
        >
          Repay with Collateral
        </button>
      </div>
      <div className="mb-4 font-bold">How much would you like to repay?</div>
      <div className="mb-6">
        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-3 shadow dark:shadow-none">
          <div className="flex flex-col flex-1 justify-between gap-2">
            <NumberInput
              className="text-2xl placeholder-gray-400 outline-none bg-transparent"
              value={value}
              onValueChange={setValue}
              placeholder="0.0000"
            />
            <div className="text-gray-400 dark:text-gray-500 text-sm">
              ~$0.0000
            </div>
          </div>
          <div className="flex flex-col items-end justify-between">
            <div className="flex w-fit items-center rounded-full bg-gray-100 dark:bg-gray-700 py-1 pl-2 pr-3 gap-2">
              <img
                src={position?.currency.logo}
                alt={position?.currency.name}
                className="w-5 h-5"
              />
              <div>{position?.currency.symbol}</div>
            </div>
            <div className="flex text-sm gap-2">
              <div className="text-gray-500">Available</div>
              <div>{position?.amount}</div>
              <button className="text-green-500">MAX</button>
            </div>
          </div>
        </div>
      </div>
      <div className="font-bold mb-3">Transaction Overview</div>
      <div className="flex flex-col gap-2 text-gray-500 text-sm mb-8">
        <div>Remaining Debt</div>
        <div>LTV</div>
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

export default RepayModal
