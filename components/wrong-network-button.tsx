import React from 'react'

import { TriangleDownSvg } from './svg/triangle-down-svg'

export const WrongNetworkButton = ({
  openChainModal,
}: {
  openChainModal: () => void
}) => {
  return (
    <button
      className="flex items-center justify-center gap-2 md:justify-start w-8 rounded md:w-full p-0 md:py-[6px] md:px-[8px] cursor-pointer h-8 bg-gray-800 md:bg-gray-950 hover:bg-gray-600 active::bg-gray-600"
      onClick={() => openChainModal && openChainModal()}
    >
      <span className="text-red-500 inline-block">Wrong Network</span>
      <TriangleDownSvg className="fill-red-500" />
    </button>
  )
}
