import React, { useMemo, useState } from 'react'
import { useQuery } from 'wagmi'

import { Currency } from '../model/currency'
import { ChartWrapper } from '../components/chart/chart-wrapper'
import { fetchPricePoints } from '../apis/currency'
import { buildChartModel, CHART_RESOLUTION_TABLE } from '../utils/chart'
import { TimePeriod } from '../model/chart'
import { currentTimestampInSeconds } from '../utils/date'

export const ChartContainer = ({
  periodList,
  currency,
  width,
  height,
  ...props
}: {
  periodList: TimePeriod[]
  currency: Currency
  width: number
  height: number
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  const [timePeriod, setTimePeriod] = useState<(typeof periodList)[number]>(
    TimePeriod.DAY,
  )
  const { data: prices } = useQuery(
    ['chart', currency, timePeriod],
    async () => {
      const now = currentTimestampInSeconds()
      return fetchPricePoints(
        currency.address,
        CHART_RESOLUTION_TABLE[timePeriod].resolution,
        now - CHART_RESOLUTION_TABLE[timePeriod].period,
      )
    },
  )

  const chart = useMemo(
    () =>
      buildChartModel({
        dimensions: {
          width,
          height,
          marginBottom: 30,
          marginTop: 30,
        },
        prices: prices,
      }),
    [width, height, prices],
  )

  return chart && chart.error === undefined ? (
    <div {...props}>
      <ChartWrapper
        chart={chart}
        timePeriod={timePeriod}
        setTimePeriod={setTimePeriod}
        periodList={[
          TimePeriod.HOUR,
          TimePeriod.DAY,
          TimePeriod.WEEK,
          TimePeriod.MONTH,
        ]}
        currency={currency}
      />
    </div>
  ) : (
    <div className="sm:w-[480px] flex flex-col rounded-2xl flex-shrink-0 bg-white dark:bg-gray-900 p-4 sm:p-6">
      <div className="flex justify-center">
        <svg
          data-cy="price-chart"
          width={width}
          height={height}
          style={{ minWidth: '100%' }}
        />
      </div>
    </div>
  )
}
