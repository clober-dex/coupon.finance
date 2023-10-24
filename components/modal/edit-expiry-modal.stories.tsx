import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'

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
    onClose: () => {},
    epochs: 0,
    setEpochs: () => {},
    dateList: [
      {
        date: '2023-12-31',
      },
      {
        date: '2024-06-30',
      },
      {
        date: '2024-12-31',
      },
      {
        date: '2025-06-30',
      },
    ],
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Select expiry date',
    },
  },
}

export const Half: Story = {
  args: {
    onClose: () => {},
    epochs: 2,
    setEpochs: () => {},
    dateList: [
      {
        date: '2023-12-31',
      },
      {
        date: '2024-06-30',
      },
      {
        date: '2024-12-31',
      },
      {
        date: '2025-06-30',
      },
    ],
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Select expiry date',
    },
  },
}

export const Full: Story = {
  args: {
    onClose: () => {},
    epochs: 4,
    setEpochs: () => {},
    dateList: [
      {
        date: '2023-12-31',
      },
      {
        date: '2024-06-30',
      },
      {
        date: '2024-12-31',
      },
      {
        date: '2025-06-30',
      },
    ],
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
