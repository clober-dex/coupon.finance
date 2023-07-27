import React, { useState } from 'react'

import { Currency } from '../../utils/currency'
import NumberInput from '../number-input'

import Modal from './modal'

const WithdrawModal = ({
  position,
  onClose,
}: {
  position: {
    currency: Currency
    amount: string
  } | null
  onClose: () => void
}) => {
  const [value, setValue] = useState('')
  return (
    <Modal show={!!position} onClose={onClose}>
      <h1 className="font-bold text-xl mb-6">
        How much would you like to withdraw?
      </h1>
      <div className="mb-4">
        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-3">
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
      <div className="flex text-sm gap-3 mb-3">
        <span className="text-gray-500">Your deposit amount</span>
        {position?.amount} {position?.currency.symbol}
      </div>
      <div className="flex text-sm gap-3 mb-8">
        <span className="text-gray-500">Coupon repurchase cost</span>
        1.00 {position?.currency.symbol}
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

export default WithdrawModal
