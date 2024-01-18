import { Meta, StoryObj } from '@storybook/react'

import '../../../styles/globals.css'
import { SilverDragonCard } from './silver-dragon-card'

export default {
  title: 'Card/SilverDragonCard',
  component: SilverDragonCard,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof SilverDragonCard>

type Story = StoryObj<typeof SilverDragonCard>
export const Default: Story = {
  args: {
    totalPoint: 0,
  },
}
