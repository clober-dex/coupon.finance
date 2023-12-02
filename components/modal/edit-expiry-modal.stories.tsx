import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'

import EditExpiryModal from './edit-expiry-modal'

export default {
  title: 'Modal/EditExpiryModal',
  component: EditExpiryModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof EditExpiryModal>

type Story = StoryObj<typeof EditExpiryModal>

export const Default: Story = {
  args: {
    onClose: () => {},
    epochs: 0,
    setEpochs: () => {},
    dateList: ['2023-12-31', '2024-06-30', '2024-12-31', '2025-06-30'],
    debtCurrency: {
      address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
    },
    price: {
      value: 170000000000n,
      decimals: 8,
    },
    currentDebtAmount: 100000000n,
    expectedDebtAmount: 200000000n,
    currentLtv: 50,
    expectedLtv: 60,
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Select expiry date',
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
