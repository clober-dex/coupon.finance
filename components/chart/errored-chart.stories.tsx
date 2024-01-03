import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import appleStock from '@visx/mock-data/lib/mocks/appleStock'

import '../../styles/globals.css'
import { buildChartModel } from '../../utils/chart'
import { ErroredChartModel, PricePoint, TimePeriod } from '../../model/chart'

import { ErroredChart } from './errored-chart'

export default {
  title: 'Chart/ErroredChart',
  component: ErroredChart,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => {
    return (
      <div className="border border-solid border-gray-700">
        <ErroredChart {...args} />
      </div>
    )
  },
} as Meta<typeof ErroredChart>

type Story = StoryObj<typeof ErroredChart>

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
    }) as ErroredChartModel,
    periodList: [
      TimePeriod.HOUR,
      TimePeriod.DAY,
      TimePeriod.WEEK,
      TimePeriod.MONTH,
      TimePeriod.YEAR,
    ],
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
