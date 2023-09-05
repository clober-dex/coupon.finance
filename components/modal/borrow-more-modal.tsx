import React, { SVGProps, useState } from 'react'

import NumberInput from '../number-input'
import { Currency, getLogo } from '../../model/currency'

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
  position: LoanPosition
  onClose: () => void
}) => {
  const [value, setValue] = useState('')
  return (
    <Modal show={!!position} onClose={onClose}>
      <h1 className="font-bold text-sm sm:text-xl mb-4 sm:mb-6">
        How much would you like to borrow?
      </h1>
      <div className="mb-4">
        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-3 shadow dark:shadow-none">
          <div className="flex flex-col flex-1 justify-between gap-2">
            <NumberInput
              className="text-xl sm:text-2xl placeholder-gray-400 outline-none bg-transparent w-40 sm:w-auto"
              value={value}
              onValueChange={setValue}
              placeholder="0.0000"
            />
            <div className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
              ~$0.0000
            </div>
          </div>
          <div className="flex flex-col items-end justify-between">
            <div className="flex w-fit items-center rounded-full bg-gray-100 dark:bg-gray-700 py-1 pl-2 pr-3 gap-2">
              <img
                src={getLogo(position?.currency)}
                alt={position?.currency.name}
                className="w-5 h-5"
              />
              <div className="text-sm sm:text-base">
                {position?.currency.symbol}
              </div>
            </div>
            <div className="flex text-xs sm:text-sm gap-1 sm:gap-2">
              <div className="text-gray-500">Available</div>
              <div>{position?.amount}</div>
              <button className="text-green-500">MAX</button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col mb-6 sm:mb-8 gap-2 sm:gap-3 text-xs sm:text-sm">
        <div className="flex gap-3 justify-between sm:justify-start">
          <div className="text-gray-500">LTV</div>
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
        <div className="flex gap-3 justify-between sm:justify-start">
          <div className="text-gray-500">Coupon Purchase Fee</div>
          <div>24.1234 ETH</div>
        </div>
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

export default BorrowMoreModal
