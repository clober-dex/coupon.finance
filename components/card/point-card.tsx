import React from 'react'

import { toHumanFriendly } from '../../utils/numbers'

export const PointCard = ({
  title,
  value,
}: {
  title: string
  value: number
}) => (
  <div className="rounded-xl bg-white dark:bg-gray-850 flex items-center flex-grow flex-shrink-0 basis-0 py-4 pl-4 pr-3">
    <div className="flex flex-col justify-center items-start gap-2">
      <div className="text-gray-400 font-semibold text-xs lg:text-lg">
        {title}
      </div>
      <div className="font-semibold text-lg lg:text-xl">
        {toHumanFriendly(value)}
      </div>
    </div>
  </div>
)
