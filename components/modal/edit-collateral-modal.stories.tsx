import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'

import { dummyLoanPosition } from '../../.storybook/dummy-data/loan-position'

import EditCollateralModal from './edit-collateral-modal'

export default {
  title: 'EditCollateralModal',
  component: EditCollateralModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof EditCollateralModal>

type Story = StoryObj<typeof EditCollateralModal>

export const Default: Story = {
  args: {
    position: dummyLoanPosition,
    onClose: () => {},
    addCollateral: async () => {},
    removeCollateral: async () => {},
    prices: {
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1': {
        value: 2500000000000n,
        decimals: 8,
      },
    },
    value: '0.01',
    setValue: () => {},
    isWithdrawCollateral: true,
    setIsWithdrawCollateral: () => {},
    amount: dummyLoanPosition.amount,
    availableCollateralAmount: 10n,
    currentLtv: 60,
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
