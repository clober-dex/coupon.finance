import { Meta, StoryObj } from '@storybook/react'

import '../styles/globals.css'
import ThemeToggle from './theme-toggle'

export default {
  title: 'ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof ThemeToggle>

type Story = StoryObj<typeof ThemeToggle>
export const Default: Story = {
  args: {
    setTheme: () => {},
  },
}
