import { Meta, StoryObj } from '@storybook/react'

import { BalloonModal } from './balloon-modal'

export default {
  title: 'BalloonModal',
  component: BalloonModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof BalloonModal>

type Story = StoryObj<typeof BalloonModal>

export const Default: Story = {
  args: {
    text: 'Points are earned based on coupons traded via deposits/loans.',
  },
}
