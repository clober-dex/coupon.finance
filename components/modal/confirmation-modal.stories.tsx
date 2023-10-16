import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import BigNumber from 'bignumber.js'

import ConfirmationModal from './confirmation-modal'

export default {
  title: 'ConformationModal',
  component: ConfirmationModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof ConfirmationModal>

type Story = StoryObj<typeof ConfirmationModal>

export const Default: Story = {
  args: {
    confirmation: {
      title: 'Confirm',
      body: 'Are you sure you want to do this?',
      fields: [
        {
          currency: {
            address: '0x000000',
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
          },
          label: 'Field 1',
          value: 'Value 1',
        },
      ],
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
