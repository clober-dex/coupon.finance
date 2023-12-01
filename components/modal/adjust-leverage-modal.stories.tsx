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
    collateral: dummyLoanPosition.collateral,
    setMultiple: () => {},
    maxAvailableMultiple: 5,
    currentMultiple: 2,
    currentLtv: 60,
    expectedLtv: 70,
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
