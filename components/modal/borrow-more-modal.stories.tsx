import { Meta, StoryObj } from '@storybook/react'
import '../../styles/globals.css'

import { dummyLoanPosition } from '../../.storybook/dummy-data/loan-position'

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
    position: dummyLoanPosition,
    onClose: () => {},
    currencyInputValue: '0.01',
    setCurrencyInputValue: () => {},
    prices: {
      '0x0000000000000000000000000000000000000003': {
        value: 2500000000000n,
        decimals: 8,
      },
    },
    maxLoanableAmount: dummyLoanPosition.amount,
    currentLtv: 60,
    expectedLtv: 70,
    interest: dummyLoanPosition.interest,
    amount: dummyLoanPosition.amount,
    available: 0n,
    maxInterest: dummyLoanPosition.interest,
    maxLoanableAmountExcludingCouponFee: 0n,
    borrowMore: async () => {},
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
