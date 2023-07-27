import React from 'react'
import { createPortal } from 'react-dom'

const Modal = ({
  show,
  onClose,
  children,
}: { show: boolean; onClose: () => void } & React.PropsWithChildren) => {
  if (!show) {
    return <></>
  }

  return createPortal(
    <div
      className="flex items-center justify-center fixed inset-0 bg-black bg-opacity-50 z-50 dark:backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="shadow flex flex-col bg-gray-50 w-[480px] dark:bg-gray-950 text-gray-950 dark:text-white rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
