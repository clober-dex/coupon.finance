import React, { useState } from 'react'

import Slider from '../slider'
import { Currency } from '../../model/currency'
import { MAX_EPOCHS } from '../../utils/epoch'

import Modal from './modal'

const dummy = [
  { date: '24-06-30', profit: '102.37' },
  { date: '24-12-31', profit: '102.37' },
  { date: '25-06-30', profit: '102.37' },
  { date: '25-12-31', profit: '102.37' },
]
const EditExpiryModal = ({
  position,
  onClose,
}: {
  position: {
    currency: Currency
    amount: string
  } | null
  onClose: () => void
}) => {
  const [selected, setSelected] = useState(0)
  return (
    <Modal show={!!position} onClose={onClose}>
      <h1 className="font-bold text-xl mb-3">Please select expiry date</h1>
      <div className="text-gray-500 text-sm mb-8">
        To select a further date, more interest must be paid.
        <br />
        Select an earlier date to receive a refund on interest paid.
      </div>
      <div className="flex flex-col relative bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
        <div className="px-6 mb-2">
          <Slider
            length={MAX_EPOCHS}
            value={selected}
            onValueChange={setSelected}
          />
        </div>
        <div className="flex justify-between">
          {dummy.map(({ date }, i) => (
            <button
              key={i}
              className="flex flex-col items-center gap-2 w-[72px]"
              onClick={() => setSelected(i + 1)}
            >
              <div className="text-sm">{date}</div>
            </button>
          ))}
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

export default EditExpiryModal
