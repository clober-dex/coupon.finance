import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { HelperModalButton } from './helper-modal-button'

export default {
  title: 'Button/HelperModalButton',
  component: HelperModalButton,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => (
    <div className="w-[97px] h-[32px]">
      <HelperModalButton {...args} />
    </div>
  ),
} as Meta<typeof HelperModalButton>

type Story = StoryObj<typeof HelperModalButton>
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
