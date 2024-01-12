import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { dummyLoanPosition } from '../../.storybook/dummy-data/loan-position'

import { LeveragePositionCard } from './leverage-position-card'

export default {
  title: 'Card/LeveragePositionCard',
  component: LeveragePositionCard,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => (
    <div className={'w-96'}>
      <LeveragePositionCard {...args} />
    </div>
  ),
} as Meta<typeof LeveragePositionCard>

type Story = StoryObj<typeof LeveragePositionCard>
export const Default: Story = {
  args: {
    position: dummyLoanPosition,
    multiple: 3.33,
    pnl: 1.1011,
    profit: 1.1011,
    price: {
      value: 990000000n,
      decimals: 8,
    },
    collateralPrice: {
      value: 176800000000n,
      decimals: 8,
    },
    entryCollateralCurrencyPrice: {
      value: 106800000000n,
      decimals: 8,
    },
    isDeptSizeLessThanMinDebtSize: false,
  },
}

export const isPendingPosition: Story = {
  args: {
    position: { ...dummyLoanPosition, isPending: true },
    multiple: 3.33,
    pnl: 1.1,
    profit: 1.1011,
    price: {
      value: 990000000n,
      decimals: 8,
    },
    collateralPrice: {
      value: 176800000000n,
      decimals: 8,
    },
    entryCollateralCurrencyPrice: {
      value: 106800000000n,
      decimals: 8,
    },
    isDeptSizeLessThanMinDebtSize: false,
  },
}

export const SmallDeptPosition: Story = {
  args: {
    position: dummyLoanPosition,
    multiple: 3.33,
    price: {
      value: 990000000n,
      decimals: 8,
    },
    collateralPrice: {
      value: 176800000000n,
      decimals: 8,
    },
    entryCollateralCurrencyPrice: {
      value: 106800000000n,
      decimals: 8,
    },
    isDeptSizeLessThanMinDebtSize: true,
  },
}

export const LiquidatedPosition: Story = {
  args: {
    position: { ...dummyLoanPosition, amount: 0n },
    multiple: 3.33,
    pnl: 1.1,
    profit: 1.1011,
    price: {
      value: 990000000n,
      decimals: 8,
    },
    collateralPrice: {
      value: 176800000000n,
      decimals: 8,
    },
    entryCollateralCurrencyPrice: {
      value: 106800000000n,
      decimals: 8,
    },
    isDeptSizeLessThanMinDebtSize: false,
  },
}

export const NegativeProfitPosition: Story = {
  args: {
    position: dummyLoanPosition,
    multiple: 3.33,
    pnl: 0.899,
    profit: 1.1011,
    price: {
      value: 990000000n,
      decimals: 8,
    },
    collateralPrice: {
      value: 176800000000n,
      decimals: 8,
    },
    entryCollateralCurrencyPrice: {
      value: 106800000000n,
      decimals: 8,
    },
    isDeptSizeLessThanMinDebtSize: false,
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
