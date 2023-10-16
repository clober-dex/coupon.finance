import { Meta, StoryObj } from '@storybook/react'
import '../../styles/globals.css'
import BigNumber from 'bignumber.js'

import BorrowMoreModal from './borrow-more-modal'

export default {
  title: 'BorrowMoreModal',
  component: BorrowMoreModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof BorrowMoreModal>

type Story = StoryObj<typeof BorrowMoreModal>

export const Default: Story = {
  args: {
    position: {
      id: 0n,
      substitute: {
        address: '0x000000',
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      underlying: {
        address: '0x000000',
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      collateral: {
        underlying: {
          address: '0x000000',
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
        substitute: {
          address: '0x000000',
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
        liquidationThreshold: '0',
        liquidationTargetLtv: '0',
      },
      interest: 10n,
      amount: 110n,
      collateralAmount: 10n,
      fromEpoch: {
        id: 0,
        startTimestamp: 0,
        endTimestamp: 0,
      },
      toEpoch: {
        id: 0,
        startTimestamp: 0,
        endTimestamp: 0,
      },
      createdAt: 0,
    },
    onClose: () => {},
    value: '',
    setValue: () => {},
    prices: {
      '0x000000': {
        value: 0n,
        decimals: 18,
      },
    },
    maxLoanAmount: 0n,
    currentLtv: BigNumber(0),
    expectedLtv: 0,
    interest: 0n,
    amount: 0n,
    available: 0n,
    maxInterest: 0n,
    maxLoanAmountExcludingCouponFee: 0n,
    borrowMore: async () => {},
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
