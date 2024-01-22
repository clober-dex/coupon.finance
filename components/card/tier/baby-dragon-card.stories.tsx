import { Meta, StoryObj } from '@storybook/react'

import '../../../styles/globals.css'
import { BadyDragonCard } from './bady-dragon-card'

export default {
  title: 'Card/BadyDragonCard',
  component: BadyDragonCard,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof BadyDragonCard>

type Story = StoryObj<typeof BadyDragonCard>
export const Default: Story = {
  args: {
    totalPoint: 0,
  },
}
