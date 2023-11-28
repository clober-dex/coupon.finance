import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import ThemeToggleButton from './theme-toggle-button'

export default {
  title: 'Button/ThemeToggleButton',
  component: ThemeToggleButton,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof ThemeToggleButton>

type Story = StoryObj<typeof ThemeToggleButton>
export const Default: Story = {
  args: {
    setTheme: () => {},
  },
}
