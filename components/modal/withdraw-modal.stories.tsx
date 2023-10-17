import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { dummyBondPosition } from '../../.storybook/dummy-data/bond-position'

import WithdrawModal from './withdraw-modal'

export default {
  title: 'WithdrawModal',
  component: WithdrawModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof WithdrawModal>

type Story = StoryObj<typeof WithdrawModal>

export const Default: Story = {
  args: {
    position: dummyBondPosition,
    onClose: () => {},
    value: '0.01',
    setValue: () => {},
    prices: {
      '0x0000000000000000000000000000000000000001': {
        value: 99970000n,
        decimals: 8,
      },
      '0x0000000000000000000000000000000000000002': {
        value: 2400000000000n,
        decimals: 8,
      },
      '0x0000000000000000000000000000000000000003': {
        value: 176800000000n,
        decimals: 8,
      },
    },
    withdraw: async () => {},
    amount: dummyBondPosition.amount,
    maxRepurchaseFee: 0n,
    repurchaseFee: 0n,
    available: 10n,
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
