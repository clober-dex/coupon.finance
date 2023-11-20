import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'

import { dummyCurrencies } from '../../.storybook/dummy-data/currencies'

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
    inputCurrencies: dummyCurrencies,
    outputCurrencies: dummyCurrencies,
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
    inputCurrencies: dummyCurrencies,
    outputCurrencies: dummyCurrencies,
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
