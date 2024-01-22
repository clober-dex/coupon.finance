import { Meta, StoryObj } from '@storybook/react'

import '../../../styles/globals.css'
import { DragonEggCard } from './dragon-egg-card'

export default {
  title: 'Card/DragonEggCard',
  component: DragonEggCard,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof DragonEggCard>

type Story = StoryObj<typeof DragonEggCard>
export const Default: Story = {
  args: {
    totalPoint: 0,
  },
}
