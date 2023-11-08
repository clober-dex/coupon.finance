import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { DepositDetailCard } from './deposit-detail-card'

export default {
  title: 'DepositDetailCard',
  component: DepositDetailCard,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof DepositDetailCard>

type Story = StoryObj<typeof DepositDetailCard>
export const Default: Story = {
  args: {
    currency: {
      address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
    },
    apys: [
      { date: '01 Jun 2024', apy: 12.1 },
      { date: '01 Dec 2024', apy: 10.1 },
      { date: '01 Jun 2023', apy: 2.1 },
    ],
  },
}
