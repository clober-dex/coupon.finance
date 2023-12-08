import React from 'react'
import appleStock from '@visx/mock-data/lib/mocks/appleStock'
import { useQuery } from 'wagmi'

import { Currency } from '../model/currency'
import { useCurrencyContext } from '../contexts/currency-context'
import { ChartWrapper } from '../components/chart/chart-wrapper'
import { fetchChart } from '../apis/currency'
import { KRAKEN_MARKET_ID } from '../constants/currencies'

export const ChartContainer = ({
  currency,
  intervalList,
  width,
  height,
  ...props
}: {
  currency: Currency
  intervalList: number[]
  width: number
  height: number
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  const { prices } = useCurrencyContext()
  const [interval, setInterval] = React.useState(intervalList[0])

  const { data } = useQuery(
    ['chart', currency, interval],
    async () => {
      return fetchChart(
        KRAKEN_MARKET_ID[currency.symbol as keyof typeof KRAKEN_MARKET_ID],
        interval,
      )
    },
    {
      refetchOnWindowFocus: true,
    },
  )

  return (
    <div {...props}>
      <ChartWrapper
        data={data ?? []}
        currency={currency}
        price={prices[currency.address]}
        intervalList={intervalList}
        interval={interval}
        setInterval={setInterval}
        width={width}
        height={height}
      />
    </div>
  )
}
