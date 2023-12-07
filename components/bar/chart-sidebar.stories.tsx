import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { ChartSidebar } from './chart-sidebar'

export default {
  title: 'Sidebar/ChartSidebar',
  component: ChartSidebar,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => {
    return (
      <div className="border border-solid border-gray-700">
        <ChartSidebar {...args} />
      </div>
    )
  },
} as Meta<typeof ChartSidebar>

type Story = StoryObj<typeof ChartSidebar>
export const Default: Story = {
  args: {
    currency: {
      address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
      name: 'Wrapped BTC',
      symbol: 'WBTC',
      decimals: 8,
    },
    price: {
      value: 2500000000000n,
      decimals: 8,
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
