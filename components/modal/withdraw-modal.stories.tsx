import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { dummyBondPosition } from '../../.storybook/dummy-data/bond-position'

import WithdrawModal from './withdraw-modal'

export default {
  title: 'Modal/WithdrawModal',
  component: WithdrawModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof WithdrawModal>

type Story = StoryObj<typeof WithdrawModal>

export const Default: Story = {
  args: {
    depositCurrency: dummyBondPosition.underlying,
    depositedAmount: dummyBondPosition.amount,
    withdrawAmount: 500000000000000000000n,
    onClose: () => {},
    value: '0.01',
    setValue: () => {},
    repurchaseFee: 0n,
    maxWithdrawAmount: 1000000000000000000000n,
    depositAssetPrice: {
      value: 99970000n,
      decimals: 8,
    },
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Withdraw',
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
