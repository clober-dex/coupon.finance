import { Meta, StoryObj } from '@storybook/react'

import '../../../styles/globals.css'
import { GoldDragonCard } from './gold-dragon-card'

export default {
  title: 'Card/GoldDragonCard',
  component: GoldDragonCard,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof GoldDragonCard>

type Story = StoryObj<typeof GoldDragonCard>
export const Default: Story = {
  args: {
    totalPoint: 0,
  },
}
