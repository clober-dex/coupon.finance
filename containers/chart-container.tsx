import React, { useMemo, useState } from 'react'
import { useQuery } from 'wagmi'

import { Currency } from '../model/currency'
import { ChartWrapper } from '../components/chart/chart-wrapper'
import { fetchPricePoints } from '../apis/currency'
import { buildChartModel, CHART_RESOLUTION_TABLE } from '../utils/chart'
import { TimePeriod } from '../model/chart'
import { currentTimestampInSeconds } from '../utils/date'

export const ChartContainer = ({
  currency,
  width,
  height,
  ...props
}: {
  currency: Currency
  width: number
  height: number
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(TimePeriod.DAY)
  const { data: prices } = useQuery(['chart', currency], async () => {
    const now = currentTimestampInSeconds()
    return fetchPricePoints(
      currency.address,
      CHART_RESOLUTION_TABLE[timePeriod].resolution,
      now - CHART_RESOLUTION_TABLE[timePeriod].period,
    )
  })

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
      <ChartWrapper chart={chart} timePeriod={timePeriod} currency={currency} />
    </div>
  ) : (
    <></>
  )
}
