import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import CurrencyAmountInput from './currency-amount-input'

export default {
  title: 'CurrencyAmountInput',
  component: CurrencyAmountInput,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => (
    <div className="border border-solid border-gray-700">
      <CurrencyAmountInput {...args} />
    </div>
  ),
} as Meta<typeof CurrencyAmountInput>

type Story = StoryObj<typeof CurrencyAmountInput>
export const Default: Story = {
  args: {
    currency: {
      address: '0x0000000000000000000000000000000000000003',
      name: 'WETH',
      symbol: 'WETH',
      decimals: 18,
    },
    value: '1',
    onValueChange: () => {},
    availableAmount: 1000000000000000000n,
    price: {
      value: 176800000000n,
      decimals: 8,
    },
  },
}

export const SelectToken: Story = {
  args: {
    value: '0',
    onValueChange: () => {},
    availableAmount: 1000000000000000000n,
    price: {
      value: 176800000000n,
      decimals: 8,
    },
    onCurrencyClick: () => {},
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
