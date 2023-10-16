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
        address: '0x0000000000000000000000000000000000000003',
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      underlying: {
        address: '0x0000000000000000000000000000000000000003',
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      collateral: {
        underlying: {
          address: '0x0000000000000000000000000000000000000003',
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
        substitute: {
          address: '0x0000000000000000000000000000000000000003',
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
        liquidationThreshold: '90',
        liquidationTargetLtv: '80',
      },
      interest: 10n,
      amount: 110n,
      collateralAmount: 10n,
      fromEpoch: {
        id: 107,
        startTimestamp: 1688169600,
        endTimestamp: 1704067199,
      },
      toEpoch: {
        id: 110,
        startTimestamp: 1735689600,
        endTimestamp: 1751327999,
      },
      createdAt: 0,
    },
    onClose: () => {},
    value: '',
    setValue: () => {},
    prices: {
      '0x0000000000000000000000000000000000000003': {
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
