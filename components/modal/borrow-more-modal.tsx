import React, { SVGProps, useState } from 'react'

import { Currency } from '../../utils/currency'
import NumberInput from '../number-input'

import Modal from './modal'

const Arrow = (props: SVGProps<any>) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.875 6L9.75 6"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
    <path
      d="M6.75 9.375L10.125 6L6.75 2.625"
      stroke="#6B7280"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
  </svg>
)

const BorrowMoreModal = ({
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
        How much would you like to borrow?
      </h1>
      <div className="mb-4">
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
      <div className="flex flex-col mb-8 gap-3 text-sm">
        <div className="flex gap-3">
          <div>LTV</div>
          <div className="flex items-center gap-1">
            <span className="text-green-500">37.28%</span>
            {value ? (
              <>
                <Arrow />
                <span className="text-red-500">12.12%</span>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="text-gray-500">Coupon Purchase Fee</div>
          <div>24.1234 ETH</div>
        </div>
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

export default BorrowMoreModal
