import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { dummyMarket } from '../../.storybook/dummy-data/market'

import { CouponUserBalanceModal } from './coupon-user-balance-modal'

export default {
  title: 'Modal/CouponUserBalanceModal',
  component: CouponUserBalanceModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof CouponUserBalanceModal>

type Story = StoryObj<typeof CouponUserBalanceModal>
export const Default: Story = {
  args: {
    assets: [],
    couponBalances: [
      {
        balance: 10000000000000000000000n,
        market: dummyMarket,
        assetValue: 10000000000000000000000n,
        erc20Balance: 10000000000000000000000n,
        erc1155Balance: 0n,
      },
      {
        balance: 10000000000000000000000n,
        market: dummyMarket,
        assetValue: 10000000000000000000000n,
        erc20Balance: 10000000000000000000000n,
        erc1155Balance: 0n,
      },
    ],
    sellCoupons: async () => {},
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
