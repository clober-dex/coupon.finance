import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'

import { SwapForm } from './swap-form'

export default {
  title: 'SwapForm',
  component: SwapForm,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof SwapForm>

type Story = StoryObj<typeof SwapForm>
export const Default: Story = {
  args: {
    currencies: [
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
        address: '0x0000000000000000000000000000000000000003',
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
    prices: {},
    inputCurrency: {
      address: '0x0000000000000000000000000000000000000003',
      name: 'WETH',
      symbol: 'WETH',
      decimals: 18,
    },
    setInputCurrency: () => {},
    inputCurrencyAmount: '0.1',
    setInputCurrencyAmount: () => {},
    availableInputCurrencyBalance: 10000000000000000000n,
    outputCurrency: {
      address: '0x0000000000000000000000000000000000000004',
      name: 'USDT',
      symbol: 'USDT',
      decimals: 6,
    },
    setOutputCurrency: () => {},
    outputCurrencyAmount: '0.1',
  },
}

export const SwapWithSlippage: Story = {
  args: {
    currencies: [
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
        address: '0x0000000000000000000000000000000000000003',
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
    prices: {},
    inputCurrency: {
      address: '0x0000000000000000000000000000000000000003',
      name: 'WETH',
      symbol: 'WETH',
      decimals: 18,
    },
    setInputCurrency: () => {},
    inputCurrencyAmount: '0.1',
    setInputCurrencyAmount: () => {},
    availableInputCurrencyBalance: 10000000000000000000n,
    outputCurrency: {
      address: '0x0000000000000000000000000000000000000004',
      name: 'USDT',
      symbol: 'USDT',
      decimals: 6,
    },
    setOutputCurrency: () => {},
    showSlippageSelect: false,
    setShowSlippageSelect: () => {},
    slippage: '1',
    setSlippage: () => {},
    outputCurrencyAmount: '0.1',
    gasEstimateValue: 100,
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
