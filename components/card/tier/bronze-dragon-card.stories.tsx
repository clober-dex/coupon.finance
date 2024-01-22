import { Meta, StoryObj } from '@storybook/react'

import '../../../styles/globals.css'
import { BronzeDragonCard } from './bronze-dragon-card'

export default {
  title: 'Card/BronzeDragonCard',
  component: BronzeDragonCard,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof BronzeDragonCard>

type Story = StoryObj<typeof BronzeDragonCard>
export const Default: Story = {
  args: {
    totalPoint: 0,
  },
}
