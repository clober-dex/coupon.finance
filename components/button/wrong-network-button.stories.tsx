import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { WrongNetworkButton } from './wrong-network-button'

export default {
  title: 'Button/WrongNetworkButton',
  component: WrongNetworkButton,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof WrongNetworkButton>

type Story = StoryObj<typeof WrongNetworkButton>

export const Default: Story = {
  args: {
    openChainModal: () => {},
  },
}
