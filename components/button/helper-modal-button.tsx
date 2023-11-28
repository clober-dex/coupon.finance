import React from 'react'

export type HelperModalButtonProps = {
  onClick: () => void
  text: string
  bounce?: boolean
}

export const HelperModalButton = ({
  onClick,
  text,
  bounce,
}: HelperModalButtonProps) => {
  return (
    <div className={bounce ? 'animate-bounce' : ''}>
      <button
        onClick={onClick}
        className="flex px-3 py-1.5 items-center gap-1 bg-green-500 bg-opacity-10 rounded text-sm font-semibold text-green-500 hover:bg-opacity-20"
      >
        {text}
      </button>
    </div>
  )
}
