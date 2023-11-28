import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'

import { dummyLoanPosition } from '../../.storybook/dummy-data/loan-position'

import EditCollateralModal from './edit-collateral-modal'

export default {
  title: 'Modal/EditCollateralModal',
  component: EditCollateralModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof EditCollateralModal>

type Story = StoryObj<typeof EditCollateralModal>

export const Default: Story = {
  args: {
    collateral: dummyLoanPosition.collateral,
    onClose: () => {},
    value: '0.01',
    setValue: () => {},
    isWithdrawCollateral: true,
    setIsWithdrawCollateral: () => {},
    availableCollateralAmount: 100000000n,
    currentLtv: 60,
    expectedLtv: 70,
    collateralPrice: {
      value: 2500000000000n,
      decimals: 8,
    },
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Edit Collateral',
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
