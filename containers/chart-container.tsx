import React, { useMemo, useState } from 'react'
import { useQuery } from 'wagmi'

import { Currency } from '../model/currency'
import { ChartWrapper } from '../components/chart/chart-wrapper'
import { fetchPricePoints } from '../apis/currency'
import { buildChartModel, CHART_RESOLUTION_TABLE } from '../utils/chart'
import { TimePeriod } from '../model/chart'
import { currentTimestampInSeconds } from '../utils/date'
import { ErroredChart } from '../components/chart/errored-chart'

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

  return (
    <div {...props}>
      {chart && chart.error === undefined ? (
        <ChartWrapper
          chart={chart}
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
          periodList={periodList}
        />
      ) : (
        <ErroredChart chart={chart} periodList={periodList} />
      )}
    </div>
  )
}
