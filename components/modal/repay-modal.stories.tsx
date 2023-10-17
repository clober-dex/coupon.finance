import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'

import { dummyLoanPosition } from '../../.storybook/dummy-data/loan-position'
import { min } from '../../utils/bigint'

import RepayModal from './repay-modal'

export default {
  title: 'RepayModal',
  component: RepayModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof RepayModal>

type Story = StoryObj<typeof RepayModal>

console.log('min test')

export const Default: Story = {
  args: {
    onClose: () => {},
    setShowSlippageSelect: () => {},
    isUseCollateral: true,
    setIsUseCollateral: () => {},
    position: dummyLoanPosition,
    value: '0.01',
    setValue: () => {},
    prices: {
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1': {
        value: 2500000000000n,
        decimals: 8,
      },
    },
    repayAmount: dummyLoanPosition.amount,
    available: 10n,
    balances: {
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1': 10n,
    },
    showSlippageSelect: false,
    slippage: '0.5',
    setSlippage: () => {},
    currentLtv: '60',
    expectedLtv: '70',
    userAddress: '0x0000000000000000000000000000000000000003',
    pathId: '0x0000000000000000000000000000000000000003',
    repayWithCollateral: async () => {},
    repay: async () => {},
    amount: dummyLoanPosition.amount,
    refund: 0n,
    minBalance: dummyLoanPosition.amount,
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
