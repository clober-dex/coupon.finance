import React from 'react'

import { toHumanFriendly } from '../../../utils/numbers'
import { GoldDragonSvg } from '../../svg/tier/gold-dragon-svg'
import { FourthTierSvg } from '../../svg/tier/fourth-tier-svg'

export const GoldDragonCard = ({ totalPoint }: { totalPoint: number }) => (
  <div className="mb-4 flex justify-center lg:mb-8">
    <div className="flex items-center gap-6 p-4 rounded-2xl bg-[#FFF5DB] dark:bg-amber-300 dark:bg-opacity-20 lg:p-6 lg:rounded-3xl">
      <GoldDragonSvg className="w-20 h-20 lg:w-32 lg:h-32" />

      <div className="flex flex-col gap-3 lg:gap-4">
        <div className="flex flex-row items-end gap-2 text-sm font-bold lg:text-xl">
          <FourthTierSvg className="w-6 h-4 lg:w-8 lg:h-6" />
          Gold Dragon
        </div>
        <p className="font-semibold text-xs text-gray-400 lg:text-lg">
          <span className="block">
            Boost point <span className="text-[#E9A800]">4%</span>
          </span>
          <span className="block">
            <span className="text-[#E9A800]">
              {toHumanFriendly(500 * 1000000 - 1 - totalPoint)} points
            </span>{' '}
            more for level up
          </span>
        </p>
      </div>
    </div>
  </div>
)
