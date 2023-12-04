import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { LongLeverageCard } from './long-leverage-card'

export default {
  title: 'Card/LongLeverageCard',
  component: LongLeverageCard,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => {
    return (
      <div className="w-[296px]">
        <LongLeverageCard {...args} />
      </div>
    )
  },
} as Meta<typeof LongLeverageCard>

type Story = StoryObj<typeof LongLeverageCard>
export const Default: Story = {
  args: {
    collateralCurrency: {
      address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
    },
    debtCurrencies: [
      {
        address: '0x0000000000000000000000000000000000000001',
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6,
      },
      {
        address: '0x0000000000000000000000000000000000000002',
        name: 'WBTC',
        symbol: 'WBTC',
        decimals: 8,
      },
      {
        address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
        name: 'WETH',
        symbol: 'WETH',
        decimals: 18,
      },
      {
        address: '0x0000000000000000000000000000000000000004',
        name: 'USDT',
        symbol: 'USDT',
        decimals: 6,
      },
      {
        address: '0x0000000000000000000000000000000000000005',
        name: 'DAI',
        symbol: 'DAI',
        decimals: 18,
      },
    ],
    lowestApy: 3.42,
    maxMultiplier: 5,
    prices: {
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1': {
        value: 200000000000n,
        decimals: 8,
      },
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
