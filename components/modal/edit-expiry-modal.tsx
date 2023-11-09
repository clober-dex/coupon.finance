import React from 'react'

import Slider from '../../components/slider'
import Modal from '../../components/modal/modal'
import { ActionButton, ActionButtonProps } from '../button/action-button'

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
        To select a further date, more interest must be paid. Select an earlier
        date to receive a refund on interest paid.
      </div>
      <div className="flex flex-row-reverse justify-between sm:flex-col relative bg-white dark:bg-gray-900 rounded-lg p-4 sm:h-[116px]">
        {dateList.length === 0 ? (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-green-500 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            />
          </div>
        ) : (
          <></>
        )}
        <div className="sm:px-6 sm:mb-2">
          <div>
            <Slider
              length={dateList?.length ?? 0}
              value={epochs}
              onValueChange={setEpochs}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between">
          {(dateList ?? []).map(({ date }, index) => (
            <button
              key={index}
              className="flex sm:flex-col items-center gap-1 sm:gap-2"
              onClick={() => setEpochs(index + 1)}
            >
              <div className="text-sm w-24 sm:w-fit text-start">{date}</div>
            </button>
          ))}
        </div>
      </div>
      <ActionButton {...actionButtonProps} />
    </Modal>
  )
}

export default EditExpiryModal
