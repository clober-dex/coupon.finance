import React from 'react'

export type ActionButtonProps = {
  disabled: boolean
  onClick: () => void
  text: string
}

export const ActionButton = ({
  disabled,
  onClick,
  text,
  ...props
}: ActionButtonProps &
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-full font-bold text-base sm:text-xl bg-green-500 hover:bg-green-400 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
      {...props}
    >
      {text}
    </button>
  )
}
