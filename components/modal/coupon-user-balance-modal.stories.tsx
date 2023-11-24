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
    couponBalances: [
      {
        balance: 10000000000000000000000n,
        market: dummyMarket,
      },
      {
        balance: 10000000000000000000000n,
        market: dummyMarket,
      },
    ],
    sellCoupons: async () => {},
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
