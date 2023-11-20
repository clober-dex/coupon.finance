import React from 'react'

import { ArrowLeftRightSvg } from '../svg/arrow-left-right-svg'

export const SwapButton = ({
  setShowSwapModal,
}: {
  setShowSwapModal: (openSwapModal: boolean) => void
}) => {
  return (
    <button
      className="flex items-center justify-center gap-2 md:justify-start w-8 rounded sm:rounded-lg sm:w-full py-0 sm:px-3 cursor-pointer h-8 bg-gray-50 md:bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 active::bg-gray-600 text-base"
      onClick={() => setShowSwapModal(true)}
    >
      <ArrowLeftRightSvg className="w-full sm:w-4 sm:h-4" />
      <span className="hidden md:block font-semibold text-sm">
        Switch Tokens
      </span>
    </button>
  )
}
