import React from 'react'

import { BigDecimal, formatDollarValue } from '../../utils/numbers'
import { Currency } from '../../model/currency'

export const ChartSidebar = ({
  currency,
  price,
  intervals,
  interval,
  setInterval,
  ...props
}: {
  currency: Currency
  price: BigDecimal
  intervals: string[]
  interval: string
  setInterval: (interval: string) => void
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  return (
    <div {...props}>
      <div className="rounded-2xl flex-shrink-0 bg-white dark:bg-gray-900 flex w-full p-4 sm:p-6 sm:w-[480px] h-[240px] sm:h-[480px]">
        <div className="flex items-start flex-grow shrink-0 basis-0">
          <div className="flex-1 flex flex-col items-start gap-1 flex-grow shrink-0 basis-0">
            <div className="text-xs sm:text-sm text-gray-500">
              Current Price ({currency.symbol})
            </div>
            <div className="flex items-end gap-1">
              <div className="font-semibold sm:text-lg">
                {formatDollarValue(
                  BigInt(Math.pow(10, currency.decimals)),
                  currency.decimals,
                  price,
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-start ">
            <div className="flex ml-auto gap-1 sm:gap-2">
              {intervals.map((i) => (
                <button
                  key={i}
                  onClick={() => setInterval(i)}
                  className={`text-xs sm:text-sm flex px-2 py-1 flex-col justify-center items-center gap-2.5 min-w-[40px] rounded-2xl ${
                    interval === i ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
