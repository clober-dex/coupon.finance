import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { PointCard } from './point-card'

export default {
  title: 'Card/PointCard',
  component: PointCard,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof PointCard>

type Story = StoryObj<typeof PointCard>
export const Default: Story = {
  args: {
    title: 'Deposit points',
    value: '100000',
  },
}
