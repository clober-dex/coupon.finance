import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { ConnectButton } from './connect-button'

export default {
  title: 'Button/ConnectButton',
  component: ConnectButton,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof ConnectButton>

type Story = StoryObj<typeof ConnectButton>

export const Default: Story = {
  args: {
    openConnectModal: () => {},
  },
}
