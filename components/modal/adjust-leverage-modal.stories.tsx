import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'

import { dummyLoanPosition } from '../../.storybook/dummy-data/loan-position'

import AdjustLeverageModal from './adjust-leverage-modal'

export default {
  title: 'Modal/AdjustLeverageModal',
  component: AdjustLeverageModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof AdjustLeverageModal>

type Story = StoryObj<typeof AdjustLeverageModal>

export const Default: Story = {
  args: {
    isLoadingResults: false,
    onClose: () => {},
    multiple: 3,
    debtCurrency: dummyLoanPosition.underlying,
    debtCurrencyPrice: {
      value: 200000000000000000n,
      decimals: 18,
    },
    collateral: dummyLoanPosition.collateral,
    collateralPrice: {
      value: 200000000000000000n,
      decimals: 18,
    },
    setMultiple: () => {},
    maxAvailableMultiple: 5,
    previousMultiple: 2,
    currentLtv: 60,
    expectedLtv: 70,
    currentPositionSize: 10000000000n,
    expectedPositionSize: 20000000000n,
    currentRemainingDebt: 10000000000n,
    expectedRemainingDebt: 20000000000n,
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Edit Multiple',
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
