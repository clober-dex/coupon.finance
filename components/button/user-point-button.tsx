import React from 'react'
import Link from 'next/link'

export const UserPointButton = ({ score }: { score: number }) => {
  return (
    <Link href="https://docs.coupon.finance/tokenomics/points" target="_blank">
      <div className="cursor-pointer flex h-8 p-2 sm:px-3 text-xs sm:text-base justify-center bg-gray-50 dark:bg-gray-800 items-center gap-1 shrink-0 border-solid rounded sm:rounded-lg">
        <span>{score}</span>
        <span className="text-gray-500 dark:text-gray-400">pts</span>
      </div>
    </Link>
  )
}
