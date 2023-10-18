import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'

import { dummyLoanPosition } from '../../.storybook/dummy-data/loan-position'

import EditExpiryModal from './edit-expiry-modal'

export default {
  title: 'EditExpiryModal',
  component: EditExpiryModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof EditExpiryModal>

type Story = StoryObj<typeof EditExpiryModal>

export const Default: Story = {
  args: {
    position: dummyLoanPosition,
    onClose: () => {},
    balances: {
      '0x0000000000000000000000000000000000000001': 1000300000n,
      '0x0000000000000000000000000000000000000002': 6000000n,
      '0x0000000000000000000000000000000000000003': 100000000000000000n,
    },
    extendLoanDuration: async () => {},
    shortenLoanDuration: async () => {},
    epochs: 0,
    setEpochs: () => {},
    data: [
      {
        date: '2023-12-31',
        interest: 100000000000000000n,
        payable: true,
        refund: 0n,
        refundable: false,
        expiryEpoch: false,
      },
      {
        date: '2024-06-30',
        interest: 100000000000000000n,
        payable: true,
        refund: 0n,
        refundable: false,
        expiryEpoch: false,
      },
      {
        date: '2024-12-31',
        interest: 100000000000000000n,
        payable: true,
        refund: 0n,
        refundable: false,
        expiryEpoch: false,
      },
      {
        date: '2025-06-30',
        interest: 100000000000000000n,
        payable: true,
        refund: 0n,
        refundable: false,
        expiryEpoch: false,
      },
    ],
    expiryEpochIndex: 10,
    interest: 100000000000000000n,
    payable: true,
    refund: 0n,
    refundable: false,
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
