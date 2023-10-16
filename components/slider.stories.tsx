import { Meta, StoryObj } from '@storybook/react'

import '../styles/globals.css'
import Slider from './slider'

export default {
  title: 'Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Slider>

type Story = StoryObj<typeof Slider>
export const Default: Story = {
  args: {
    length: 4,
    value: 2,
    onValueChange: () => {},
  },
}

export const Empty: Story = {
  args: {
    length: 4,
    value: 0,
    onValueChange: () => {},
  },
}

export const Full: Story = {
  args: {
    length: 4,
    value: 4,
    onValueChange: () => {},
  },
}
