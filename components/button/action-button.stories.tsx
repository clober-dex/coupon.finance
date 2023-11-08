import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'

import { ActionButton } from './action-button'

export default {
  title: 'ActionButton',
  component: ActionButton,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => (
    <div className="w-[432px] h-[64px]">
      <ActionButton {...args} />
    </div>
  ),
} as Meta<typeof ActionButton>

type Story = StoryObj<typeof ActionButton>
export const Default: Story = {
  args: {
    disabled: false,
    onClick: () => {},
    text: 'Button',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    onClick: () => {},
    text: 'Button',
  },
}
