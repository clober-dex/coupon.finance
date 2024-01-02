import React, { useMemo } from 'react'
import { useQuery } from 'wagmi'

import { Currency } from '../model/currency'
import { ChartWrapper } from '../components/chart/chart-wrapper'
import { fetchPricePoints } from '../apis/currency'
import { KRAKEN_MARKET_ID } from '../constants/currencies'
import { buildChartModel } from '../utils/chart'

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
  const { data } = useQuery(
    ['chart', currency],
    async () => {
      return fetchPricePoints(
        KRAKEN_MARKET_ID[currency.symbol as keyof typeof KRAKEN_MARKET_ID],
        60,
      )
    },
    {
      refetchOnWindowFocus: true,
    },
  )

  const chart = useMemo(
    () =>
      buildChartModel({
        dimensions: {
          width,
          height,
          marginBottom: 30,
          marginTop: 0,
        },
        prices: data,
      }),
    [width, height, data],
  )
  console.log('chart', chart)

  return chart && chart.error === undefined ? (
    <div {...props}>
      <ChartWrapper chart={chart} timePeriod={0} currency={currency} />
    </div>
  ) : (
    <></>
  )
}
