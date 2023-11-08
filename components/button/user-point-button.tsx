import React from 'react'

import useDropdown from '../../hooks/useDropdown'
import { BalloonModal } from '../modal/balloon-modal'

export const UserPointButton = ({ score }: { score: number }) => {
  const { showDropdown, setShowDropdown } = useDropdown()

  return (
    <div>
      <button
        onClick={() => {
          setShowDropdown((prev) => !prev)
        }}
        className="inline-flex h-8 p-2 justify-center items-center gap-1 shrink-0 border-solid dark:border-white border-[1.5px] rounded"
      >
        <span>{score}</span>
        <span>pts</span>
      </button>
      <div className="absolute">
        {showDropdown ? (
          <div className="relative -right-[18px] -bottom-2 w-[280px]">
            <BalloonModal
              text={
                'Points are earned based on coupons traded via deposits/loans.'
              }
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
