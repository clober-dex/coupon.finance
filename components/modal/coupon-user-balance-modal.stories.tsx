import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { dummyMarket } from '../../.storybook/dummy-data/market'

import { CouponUserBalanceModal } from './coupon-user-balance-modal'

export default {
  title: 'CouponUserBalanceModal',
  component: CouponUserBalanceModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof CouponUserBalanceModal>

type Story = StoryObj<typeof CouponUserBalanceModal>
export const Default: Story = {
  args: {
    coupons: [
      {
        date: '01 Sep 2024',
        balance: 10000000000000000000000n,
        market: dummyMarket,
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
        market: dummyMarket,
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
