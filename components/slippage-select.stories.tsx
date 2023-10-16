import { Meta, StoryObj } from '@storybook/react'

import '../styles/globals.css'
import SlippageSelect from './slippage-select'

export default {
  title: 'SlippageSelect',
  component: SlippageSelect,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof SlippageSelect>

type Story = StoryObj<typeof SlippageSelect>
export const Default: Story = {
  args: {
    show: false,
    setShow: () => {},
    slippage: '1',
    setSlippage: () => {},
  },
}
