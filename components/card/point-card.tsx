import React from 'react'

import { RightBracketAngleSvg } from '../svg/right-bracket-angle-svg'

export const PointCard = ({
  title,
  value,
}: {
  title: string
  value: string
}) => (
  <div className="rounded-xl bg-white dark:bg-gray-850 flex items-center flex-grow flex-shrink-0 basis-0 py-4 pl-4 pr-3">
    <div className="flex flex-col justify-center items-start gap-2">
      <div className="text-gray-400 font-semibold text-xs lg:text-lg">
        {title}
      </div>
      <div className="font-semibold text-lg lg:text-xl">{value}</div>
    </div>
    <div className="flex ml-auto">
      <RightBracketAngleSvg className="w-4 h-4 lg:w-8 lg:h-8 stroke-[#9CA3AF]" />
    </div>
  </div>
)
