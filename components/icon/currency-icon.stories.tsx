import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { CurrencyIcon } from './currency-icon'

export default {
  title: 'Icon/CurrencyIcon',
  component: CurrencyIcon,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => <CurrencyIcon className="w-8 h-8" {...args} />,
} as Meta<typeof CurrencyIcon>

type Story = StoryObj<typeof CurrencyIcon>

export const Default: Story = {
  args: {
    currency: {
      address: '0x0000000000000000000000000000000000000001',
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
    },
  },
}

export const Unknown: Story = {
  args: {
    currency: {
      address: '0x0000000000000000000000000000000000000001',
      name: 'USDK',
      symbol: 'USDK',
      decimals: 6,
    },
  },
}
