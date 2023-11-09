import { Meta, StoryObj } from '@storybook/react'

import '../styles/globals.css'
import { mainnet } from 'wagmi'

import { Currency } from '../model/currency'

import { CouponWidget } from './coupon-widget'

export default {
  title: 'CouponWidget',
  component: CouponWidget,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof CouponWidget>

type Story = StoryObj<typeof CouponWidget>
export const Default: Story = {
  args: {
    chain: mainnet,
    coupons: [
      {
        date: '01 Sep 2024',
        balance: 10000000000000000000000n,
        marketAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
        coupon: {
          address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
          name: 'Wrapped Ether',
          symbol: 'WaUSDT-CP110',
          decimals: 18,
        },
      },
      {
        date: '01 Sep 2024',
        balance: 10000000000000000000000n,
        marketAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
        coupon: {
          address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
          name: 'Wrapped Ether',
          symbol: 'WaUSDT-CP110',
          decimals: 18,
        },
      },
    ],
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
