import React from 'react'

import { formatAddress, formatShortAddress } from '../../utils/string'
import { DragonEggSvg } from '../svg/tier/dragon-egg-svg'
import { BabyDragonSvg } from '../svg/tier/baby-dragon-svg'
import { GoldDragonSvg } from '../svg/tier/gold-dragon-svg'
import { BronzeDragonSvg } from '../svg/tier/bronze-dragon-svg'
import { SilverDragonSvg } from '../svg/tier/silver-dragon-svg'
import { LegendaryDragonSvg } from '../svg/tier/legendary-dragon-svg'

export const UserButton = ({
  address,
  level,
  openAccountModal,
}: {
  address: `0x${string}`
  level: number
  openAccountModal: () => void
}) => {
  return (
    <button
      className="flex items-center justify-center md:justify-start w-8 rounded sm:rounded-lg sm:w-full py-0 cursor-pointer h-8 bg-gray-50 md:bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 active::bg-gray-600 text-base"
      onClick={() => openAccountModal && openAccountModal()}
    >
      <div className="relative w-10 h-10">
        {level === 0 ? (
          <DragonEggSvg className="left-1/2 top-1/2 transform translate-x-1/2 translate-y-1/2 w-1/2 h-1/2" />
        ) : level === 1 ? (
          <BabyDragonSvg className="left-1/2 top-1/2 transform translate-x-1/2 translate-y-1/2 w-1/2 h-1/2" />
        ) : level === 2 ? (
          <BronzeDragonSvg className="left-1/2 top-1/2 transform translate-x-1/2 translate-y-1/2 w-1/2 h-1/2" />
        ) : level === 3 ? (
          <SilverDragonSvg className="left-1/2 top-1/2 transform translate-x-1/2 translate-y-1/2 w-1/2 h-1/2" />
        ) : level === 4 ? (
          <GoldDragonSvg className="left-1/2 top-1/2 transform translate-x-1/2 translate-y-1/2 w-1/2 h-1/2" />
        ) : (
          <LegendaryDragonSvg className="left-1/2 top-1/2 transform translate-x-1/2 translate-y-1/2 w-1/2 h-1/2" />
        )}
      </div>
      <span className="hidden font-semibold text-sm sm:block lg:hidden px-1">
        {formatShortAddress(address || '')}
      </span>
      <span className="hidden font-semibold text-sm lg:block px-1">
        {formatAddress(address || '')}
      </span>
    </button>
  )
}
