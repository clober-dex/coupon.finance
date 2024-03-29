import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { dummyLoanPosition } from '../../.storybook/dummy-data/loan-position'

import { LoanPositionCard } from './loan-position-card'

export default {
  title: 'Card/LoanPositionCard',
  component: LoanPositionCard,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => (
    <div className={'w-96'}>
      <LoanPositionCard {...args} />
    </div>
  ),
} as Meta<typeof LoanPositionCard>

type Story = StoryObj<typeof LoanPositionCard>
export const Default: Story = {
  args: {
    position: dummyLoanPosition,
    price: {
      value: 990000000n,
      decimals: 8,
    },
    collateralPrice: {
      value: 176800000000n,
      decimals: 8,
    },
    isDeptSizeLessThanMinDebtSize: false,
    explorerUrl: 'https://etherscan.io',
  },
}

export const isPendingPosition: Story = {
  args: {
    position: { ...dummyLoanPosition, isPending: true },
    price: {
      value: 990000000n,
      decimals: 8,
    },
    collateralPrice: {
      value: 176800000000n,
      decimals: 8,
    },
    isDeptSizeLessThanMinDebtSize: false,
    explorerUrl: 'https://etherscan.io',
  },
}

export const SmallDeptPosition: Story = {
  args: {
    position: dummyLoanPosition,
    price: {
      value: 990000000n,
      decimals: 8,
    },
    collateralPrice: {
      value: 176800000000n,
      decimals: 8,
    },
    isDeptSizeLessThanMinDebtSize: true,
    explorerUrl: 'https://etherscan.io',
  },
}

export const LiquidatedPosition: Story = {
  args: {
    position: { ...dummyLoanPosition, amount: 0n },
    price: {
      value: 990000000n,
      decimals: 8,
    },
    collateralPrice: {
      value: 176800000000n,
      decimals: 8,
    },
    isDeptSizeLessThanMinDebtSize: false,
    explorerUrl: 'https://etherscan.io',
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
