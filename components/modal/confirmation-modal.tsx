import React from 'react'
import { createPortal } from 'react-dom'

import { Confirmation } from '../../contexts/transaction-context'
import { getLogo } from '../../model/currency'

const ConfirmationModal = ({
  confirmation,
}: {
  confirmation?: Confirmation
} & React.PropsWithChildren) => {
  if (!confirmation) {
    return <></>
  }

  return createPortal(
    <div className="flex items-center justify-center fixed inset-0 bg-black bg-opacity-50 z-50 dark:backdrop-blur-sm px-4 sm:px-0">
      <div
        className="shadow flex flex-col bg-gray-50 w-full sm:w-80 dark:bg-gray-800 text-gray-950 dark:text-white rounded-xl sm:rounded-2xl p-4 gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="font-bold">{confirmation.title}</div>
            <div
              className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-green-500 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            />
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            {confirmation.body}
          </div>
        </div>
        <div>
          {confirmation.fields.map((field, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white dark:bg-gray-700 px-3 py-2 text-sm sm:text-base rounded-lg"
            >
              <div className="flex items-center gap-2">
                {field.currency ? (
                  <img
                    src={getLogo(field.currency)}
                    alt={field.currency.name}
                    className="w-5 h-5"
                  />
                ) : (
                  <></>
                )}
                <div>{field.label}</div>
              </div>
              <div>{field.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ConfirmationModal
