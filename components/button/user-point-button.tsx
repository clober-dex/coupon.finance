import React, { useCallback } from 'react'
import Link from 'next/link'
import CountUp from 'react-countup'

import { toCommaSeparated } from '../../utils/numbers'

export const UserPointButton = ({ score }: { score: number }) => {
  const countUpFormatter = useCallback((value: number): string => {
    return toCommaSeparated(value.toString())
  }, [])
  return (
    <Link href="https://docs.coupon.finance/tokenomics/points" target="_blank">
      <div className="cursor-pointer flex h-8 p-2 sm:px-3 text-xs sm:text-sm lg:text-base justify-center bg-gray-50 md:bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 items-center gap-1 shrink-0 border-solid rounded sm:rounded-lg">
        <span>
          <CountUp end={score} formattingFn={countUpFormatter} preserveValue />
        </span>
        <span className="text-gray-500 dark:text-gray-400">pts</span>
      </div>
    </Link>
  )
}
