import { Meta, StoryObj } from '@storybook/react'

import { BalloonModal } from './balloon-modal'

export default {
  title: 'Modal/BalloonModal',
  component: BalloonModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof BalloonModal>

type Story = StoryObj<typeof BalloonModal>

export const Default: Story = {
  args: {
    children: 'Coming soon!',
  },
}

export const Color: Story = {
  args: {
    // eslint-disable-next-line react/react-in-jsx-scope
    children: <div className="bg-red-300">Coming soon!</div>,
  },
}
