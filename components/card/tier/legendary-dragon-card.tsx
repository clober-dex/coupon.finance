import React from 'react'

import { LegendaryDragonSvg } from '../../svg/tier/legendary-dragon-svg'
import { FifthTierSvg } from '../../svg/tier/fifth-tier-svg'

export const LegendaryDragonCard = () => (
  <div className="mb-4 flex justify-center lg:mb-8">
    <div className="flex items-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-300 to-cyan-200 lg:p-6 lg:rounded-3xl">
      <LegendaryDragonSvg className="w-20 h-20 lg:w-32 lg:h-32" />

      <div className="flex flex-col gap-3 lg:gap-4">
        <div className="flex flex-row items-end gap-2 text-sm font-bold lg:text-xl">
          <FifthTierSvg className="w-6 h-4 lg:w-8 lg:h-6" />
          Legendary Dragon
        </div>
        <p className="font-semibold text-xs text-gray-400 lg:text-lg">
          <span className="block">
            Boost point <span className="text-[#358FD1]">5%</span>
          </span>
        </p>
      </div>
    </div>
  </div>
)
