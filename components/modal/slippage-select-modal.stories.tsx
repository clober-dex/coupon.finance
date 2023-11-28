import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import SlippageSelectModal from './slippage-select-modal'

export default {
  title: 'Modal/SlippageSelectModal',
  component: SlippageSelectModal,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof SlippageSelectModal>

type Story = StoryObj<typeof SlippageSelectModal>
export const Default: Story = {
  args: {
    slippage: '1',
    setSlippage: () => {},
  },
}
