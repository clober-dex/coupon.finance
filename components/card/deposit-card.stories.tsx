import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'

import { DepositCard } from './deposit-card'

export default {
  title: 'DepositCard',
  component: DepositCard,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => {
    return (
      <div className="w-[400px]">
        <DepositCard {...args} />
      </div>
    )
  },
} as Meta<typeof DepositCard>

type Story = StoryObj<typeof DepositCard>
export const Default: Story = {
  args: {
    currency: {
      address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
    },
    apys: [
      { date: '01 Jun 2024', apy: 12.1 },
      { date: '01 Dec 2024', apy: 10.1 },
      { date: '01 Jun 2023', apy: 2.1 },
    ],
    available: 100000000000000000000n,
    deposited: 500000000000000000000n,
    collaterals: [
      {
        underlying: {
          address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
          name: 'Wrapped BTC',
          symbol: 'WBTC',
          decimals: 8,
        },
        substitute: {
          address: '0xe494b0813d70e6b9501ddfceb2225d12b839422b',
          name: 'Wrapped Aave Wrapped BTC',
          symbol: 'WaWBTC',
          decimals: 8,
        },
        liquidationThreshold: 800000n,
        liquidationTargetLtv: 700000n,
        ltvPrecision: 1000000n,
        totalCollateralized: 10000000n,
        totalBorrowed: 12503898340000n,
      },
      {
        underlying: {
          address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
          name: 'Wrapped BTC',
          symbol: 'WBTC',
          decimals: 8,
        },
        substitute: {
          address: '0xe494b0813d70e6b9501ddfceb2225d12b839422b',
          name: 'Wrapped Aave Wrapped BTC',
          symbol: 'WaWBTC',
          decimals: 8,
        },
        liquidationThreshold: 800000n,
        liquidationTargetLtv: 700000n,
        ltvPrecision: 1000000n,
        totalCollateralized: 10000000n,
        totalBorrowed: 12503898340000n,
      },
    ],
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
