import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { UserPointButton } from './user-point-button'

export default {
  title: 'Button/UserPointButton',
  component: UserPointButton,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof UserPointButton>

type Story = StoryObj<typeof UserPointButton>

export const Default: Story = {
  args: {
    score: 6,
  },
}
