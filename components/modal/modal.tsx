import React from 'react'
import { createPortal } from 'react-dom'

import { ZIndices } from '../../utils/z-indices'
import CloseSvg from '../svg/close-svg'

const Modal = ({
  show,
  onClose,
  children,
  onModalClick,
  onButtonClick,
}: {
  show: boolean
  onClose: () => void
  onModalClick?: () => void
  onButtonClick?: () => void
} & React.PropsWithChildren) => {
  if (!show) {
    return <></>
  }

  return createPortal(
    <div
      className={`flex items-center justify-center fixed inset-0 bg-black bg-opacity-50 ${ZIndices.modal} dark:backdrop-blur-sm px-4 sm:px-0`}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col bg-gray-50 w-full sm:w-[480px] dark:bg-gray-900 text-gray-950 dark:text-white rounded-xl sm:rounded-2xl p-4 sm:p-6"
        onClick={(e) => {
          onModalClick?.()
          e.stopPropagation()
        }}
      >
        <div className="absolute right-4 sm:right-6">
          <button onClick={onButtonClick ? onButtonClick : onClose}>
            <CloseSvg />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
