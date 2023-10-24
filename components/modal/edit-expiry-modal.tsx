import React from 'react'

import Slider from '../../components/slider'
import Modal from '../../components/modal/modal'
import { ActionButton, ActionButtonProps } from '../action-button'

const EditExpiryModal = ({
  onClose,
  epochs,
  setEpochs,
  dateList,
  actionButtonProps,
}: {
  onClose: () => void
  epochs: number
  setEpochs: (value: number) => void
  dateList: {
    date: string
  }[]
  actionButtonProps: ActionButtonProps
}) => {
  return (
    <Modal show onClose={onClose}>
      <h1 className="font-bold text-xl mb-3">Please select expiry date</h1>
      <div className="text-gray-500 text-sm mb-8">
        To select a further date, more interest must be paid.
        <br />
        Select an earlier date to receive a refund on interest paid.
      </div>
      <div className="flex flex-col relative bg-white dark:bg-gray-900 rounded-lg p-4 mb-8">
        <div className="px-6 mb-2">
          <Slider
            length={dateList?.length ?? 0}
            value={epochs}
            onValueChange={setEpochs}
          />
        </div>
        <div className="flex justify-between">
          {(dateList ?? []).map(({ date }, index) => (
            <button
              key={index}
              className="flex flex-col items-center gap-2 w-[72px]"
              onClick={() => setEpochs(index + 1)}
            >
              <div className="text-sm">{date}</div>
            </button>
          ))}
        </div>
      </div>
      <ActionButton {...actionButtonProps} />
    </Modal>
  )
}

export default EditExpiryModal
