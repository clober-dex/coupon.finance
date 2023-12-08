import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import appleStock from '@visx/mock-data/lib/mocks/appleStock'

import '../../styles/globals.css'
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
export const Default: Story = {
  args: {
    data: appleStock.slice(800),
    intervalList: [240, 1440, 10080, 21600],
    interval: 240,
    setInterval: () => {},
    height: 300,
    width: 600,
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
