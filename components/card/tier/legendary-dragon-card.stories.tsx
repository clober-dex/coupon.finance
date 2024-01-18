import { Meta, StoryObj } from '@storybook/react'

import '../../../styles/globals.css'
import { LegendaryDragonCard } from './legendary-dragon-card'

export default {
  title: 'Card/LegendaryDragonCard',
  component: LegendaryDragonCard,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof LegendaryDragonCard>

type Story = StoryObj<typeof LegendaryDragonCard>
export const Default: Story = {
  args: {},
}
