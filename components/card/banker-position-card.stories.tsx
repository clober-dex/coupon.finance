import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { dummyBondPosition } from '../../.storybook/dummy-data/bond-position'

import { BankerPositionCard } from './banker-position-card'

export default {
  title: 'Card/BankerPositionCard',
  component: BankerPositionCard,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => (
    <div className={'w-96'}>
      <BankerPositionCard {...args} />
    </div>
  ),
} as Meta<typeof BankerPositionCard>

type Story = StoryObj<typeof BankerPositionCard>
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

export const isPendingPosition: Story = {
  args: {
    position: {
      ...dummyBondPosition,
      isPending: true,
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
