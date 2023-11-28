import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { CurrencyDropdown } from '../dropdown/currency-dropdown'
import DownSvg from '../svg/down-svg'

import CurrencyAmountInput from './currency-amount-input'

export default {
  title: 'Input/CurrencyAmountInput',
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
  },
}

export const WithCurrencyDropdown: Story = {
  args: {
    value: '0',
    onValueChange: () => {},
    availableAmount: 1000000000000000000n,
    price: {
      value: 176800000000n,
      decimals: 8,
    },
    children: (
      <CurrencyDropdown
        currencies={[
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
        ]}
        onCurrencySelect={() => {}}
      >
        <div className="w-fit flex items-center rounded-full bg-green-500 text-white pl-3 pr-2 py-1 gap-2 text-sm sm:text-base">
          Select token <DownSvg />
        </div>
      </CurrencyDropdown>
    ),
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
