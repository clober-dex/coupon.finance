import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { WalletSelect } from './wallet-select'

export default {
  title: 'Select/WalletSelect',
  component: WalletSelect,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof WalletSelect>

type Story = StoryObj<typeof WalletSelect>
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
