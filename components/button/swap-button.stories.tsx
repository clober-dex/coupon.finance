import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { SwapButton } from './swap-button'

export default {
  title: 'SwapButton',
  component: SwapButton,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof SwapButton>

type Story = StoryObj<typeof SwapButton>

export const Default: Story = {
  args: {
    openSwapModal: () => {},
  },
}