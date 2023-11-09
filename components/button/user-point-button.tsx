import React from 'react'

import { BalloonModal } from '../modal/balloon-modal'

export const UserPointButton = ({ score }: { score: number }) => {
  return (
    <div className="group">
      <div className="cursor-default flex h-8 p-2 sm:px-3 text-xs sm:text-base justify-center bg-white dark:bg-gray-800 items-center gap-1 shrink-0 border-solid rounded sm:rounded-lg">
        <span>{score}</span>
        <span className="text-gray-500 dark:text-gray-400">pts</span>
      </div>
      <div className="absolute hidden group-hover:block">
        <div className="relative -right-[18px] -bottom-2 w-[280px]">
          <BalloonModal>Coming Soon!</BalloonModal>
        </div>
      </div>
    </div>
  )
}
