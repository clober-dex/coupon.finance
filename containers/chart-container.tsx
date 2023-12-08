import React from 'react'
import appleStock from '@visx/mock-data/lib/mocks/appleStock'

import { Currency } from '../model/currency'
import { useCurrencyContext } from '../contexts/currency-context'
import { ChartWrapper } from '../components/chart/chart-wrapper'

export const ChartContainer = ({
  currency,
  intervalList,
  width,
  height,
  ...props
}: {
  currency: Currency
  intervalList: string[]
  width: number
  height: number
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  const { prices } = useCurrencyContext()
  const [interval, setInterval] = React.useState<(typeof intervalList)[number]>(
    intervalList[0],
  )
  return (
    <div {...props}>
      <ChartWrapper
        data={appleStock.slice(800)}
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
