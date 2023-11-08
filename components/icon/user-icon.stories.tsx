import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import UserIcon from './user-icon'

export default {
  title: 'UserIcon',
  component: UserIcon,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => (
    <UserIcon className="w-16 h-16 rounded-[100%] aspect-square" {...args} />
  ),
} as Meta<typeof UserIcon>

type Story = StoryObj<typeof UserIcon>

export const Default: Story = {
  args: {
    address: '0x0F97F07d7473EFB5c846FB2b6c201eC1E316E994',
  },
}
