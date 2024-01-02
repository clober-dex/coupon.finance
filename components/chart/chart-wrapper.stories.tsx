import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import appleStock from '@visx/mock-data/lib/mocks/appleStock'

import '../../styles/globals.css'
import { buildChartModel } from '../../utils/chart'
import { ChartModel, PricePoint, TimePeriod } from '../../model/chart'

import { ChartWrapper } from './chart-wrapper'

export default {
  title: 'Sidebar/ChartWrapper',
  component: ChartWrapper,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => {
    return (
      <div className="border border-solid border-gray-700">
        <ChartWrapper {...args} />
      </div>
    )
  },
} as Meta<typeof ChartWrapper>

type Story = StoryObj<typeof ChartWrapper>

const prices = appleStock.slice(0, 24).map((d) => ({
  timestamp: new Date(d.date).getTime(),
  value: d.close,
}))
export const Default: Story = {
  args: {
    chart: buildChartModel({
      dimensions: {
        width: 432,
        height: 386,
        marginBottom: 30,
        marginTop: 0,
      },
      prices: prices as PricePoint[],
    }) as ChartModel,
    setTimePeriod: () => {},
    timePeriod: 0,
    periodList: [
      TimePeriod.HOUR,
      TimePeriod.DAY,
      TimePeriod.WEEK,
      TimePeriod.MONTH,
      TimePeriod.YEAR,
    ],
    currency: {
      address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
      name: 'Wrapped BTC',
      symbol: 'WBTC',
      decimals: 8,
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
