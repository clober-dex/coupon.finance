import React from 'react'

import { Currency } from '../model/currency'
import { ChartSidebar } from '../components/bar/chart-sidebar'
import { useCurrencyContext } from '../contexts/currency-context'

export const ChartSidebarContainer = ({ currency }: { currency: Currency }) => {
  const intervals = ['1H', '1D', '1W', '1M', '1Y']
  const { prices } = useCurrencyContext()
  const [interval, setInterval] = React.useState<(typeof intervals)[number]>(
    intervals[0],
  )
  return (
    <ChartSidebar
      currency={currency}
      price={prices[currency.address]}
      intervals={intervals}
      interval={interval}
      setInterval={setInterval}
    />
  )
}
