import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { WalletSelector } from './wallet-selector'

export default {
  title: 'WalletSelector',
  component: WalletSelector,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof WalletSelector>

type Story = StoryObj<typeof WalletSelector>
export const Connected: Story = {
  args: {
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    status: 'connected',
  },
}

export const Disconnected: Story = {
  args: {
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    status: 'disconnected',
  },
}

export const Reconnecting: Story = {
  args: {
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    status: 'reconnecting',
  },
}

export const Connecting: Story = {
  args: {
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    status: 'connecting',
  },
}
