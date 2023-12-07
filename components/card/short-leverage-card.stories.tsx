import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { ShortLeverageCard } from './short-leverage-card'

export default {
  title: 'Card/ShortLeverageCard',
  component: ShortLeverageCard,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => {
    return (
      <div className="w-[296px]">
        <ShortLeverageCard {...args} />
      </div>
    )
  },
} as Meta<typeof ShortLeverageCard>

type Story = StoryObj<typeof ShortLeverageCard>
export const Default: Story = {
  args: {
    debtCurrency: {
      address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
    },
    collateralCurrencies: [
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
    apys: {
      '0x0000000000000000000000000000000000000001': 3.42,
      '0x0000000000000000000000000000000000000002': 4.42,
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1': 5.42,
      '0x0000000000000000000000000000000000000004': 6.42,
      '0x0000000000000000000000000000000000000005': 7.42,
    },
    maxMultipliers: {
      '0x0000000000000000000000000000000000000001': 3.42,
      '0x0000000000000000000000000000000000000002': 4.42,
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1': 5.42,
      '0x0000000000000000000000000000000000000004': 6.42,
      '0x0000000000000000000000000000000000000005': 7.42,
    },
    prices: {
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1': {
        value: 200000000000n,
        decimals: 8,
      },
    },
  },
}

export const Hover: Story = {
  args: {
    debtCurrency: {
      address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
    },
    collateralCurrencies: [
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
    apys: {
      '0x0000000000000000000000000000000000000001': 3.42,
      '0x0000000000000000000000000000000000000002': 4.42,
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1': 5.42,
      '0x0000000000000000000000000000000000000004': 6.42,
      '0x0000000000000000000000000000000000000005': 7.42,
    },
    maxMultipliers: {
      '0x0000000000000000000000000000000000000001': 3.42,
      '0x0000000000000000000000000000000000000002': 4.42,
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1': 5.42,
      '0x0000000000000000000000000000000000000004': 6.42,
      '0x0000000000000000000000000000000000000005': 7.42,
    },
    prices: {
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1': {
        value: 200000000000n,
        decimals: 8,
      },
    },
  },
}

Hover.parameters = {
  pseudo: { hover: true },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
