import React from 'react'

import { ArrowLeftRightSvg } from '../svg/arrow-left-right-svg'

export const SwapButton = ({
  setShowSwapModal,
}: {
  setShowSwapModal: (openSwapModal: boolean) => void
}) => {
  return (
    <button
      className="flex items-center justify-center gap-2 lg:justify-start w-8 h-8 rounded lg:rounded-lg lg:w-full py-0 lg:px-2.5 cursor-pointer bg-gray-50 md:bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 active::bg-gray-600 text-base"
      onClick={() => setShowSwapModal(true)}
    >
      <ArrowLeftRightSvg className="w-4 h-4" />
      <span className="hidden xl:block font-semibold text-sm">
        Switch Tokens
      </span>
    </button>
  )
}
