import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../styles/globals.css'
import { dummyBondPosition } from '../.storybook/dummy-data/bond-position'

import { BondPositionCard } from './bond-position-card'

export default {
  title: 'BondPositionCard',
  component: BondPositionCard,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => (
    <div className={'w-96'}>
      <BondPositionCard {...args} />
    </div>
  ),
} as Meta<typeof BondPositionCard>

type Story = StoryObj<typeof BondPositionCard>
export const Default: Story = {
  args: {
    position: dummyBondPosition,
    price: {
      value: 990000000n,
      decimals: 8,
    },
  },
}

export const ExpiredPosition: Story = {
  args: {
    position: {
      ...dummyBondPosition,
      toEpoch: {
        id: 107,
        startTimestamp: 0,
        endTimestamp: 0,
      },
    },
    price: {
      value: 990000000n,
      decimals: 8,
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
