import React from 'react'

import { BigDecimal, formatDollarValue } from '../../utils/numbers'
import Chart from '../chart'
import { Currency } from '../../model/currency'

export const ChartWrapper = ({
  currency,
  price,
  intervalList,
  interval,
  setInterval,
  width,
  height,
}: {
  currency: Currency
  price: BigDecimal
  intervalList: string[]
  interval: string
  setInterval: (interval: string) => void
  width: number
  height: number
}) => (
  <div className="flex flex-col rounded-2xl flex-shrink-0 bg-white dark:bg-gray-900 w-full p-4 sm:p-6">
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
          {intervalList.map((i) => (
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
    <div className="flex justify-center">
      <Chart width={width} height={height} />
    </div>
  </div>
)
