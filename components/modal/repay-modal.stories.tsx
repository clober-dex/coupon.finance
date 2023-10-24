import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'

import { dummyLoanPosition } from '../../.storybook/dummy-data/loan-position'

import RepayModal from './repay-modal'

export default {
  title: 'RepayModal',
  component: RepayModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof RepayModal>

type Story = StoryObj<typeof RepayModal>

export const Default: Story = {
  args: {
    debtCurrency: dummyLoanPosition.underlying,
    collateral: dummyLoanPosition.collateral,
    collateralAmount: dummyLoanPosition.collateralAmount,
    onClose: () => {},
    value: '0.01',
    setValue: () => {},
    showSlippageSelect: false,
    setShowSlippageSelect: () => {},
    isUseCollateral: false,
    setIsUseCollateral: () => {},
    slippage: '0.5',
    setSlippage: () => {},
    repayAmount: dummyLoanPosition.amount,
    maxRepayableAmount: dummyLoanPosition.amount - 500000n,
    currentLtv: 60,
    expectedLtv: 10,
    remainingDebt: dummyLoanPosition.amount - 1000000n,
    debtAssetPrice: {
      value: 170000000000n,
      decimals: 8,
    },
    collateralPrice: {
      value: 2500000000000n,
      decimals: 8,
    },
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Repay',
    },
  },
}

export const RepayWithCollateral: Story = {
  args: {
    debtCurrency: dummyLoanPosition.underlying,
    collateral: dummyLoanPosition.collateral,
    collateralAmount: dummyLoanPosition.collateralAmount,
    onClose: () => {},
    value: '0.01',
    setValue: () => {},
    showSlippageSelect: false,
    setShowSlippageSelect: () => {},
    isUseCollateral: true,
    setIsUseCollateral: () => {},
    slippage: '0.5',
    setSlippage: () => {},
    repayAmount: dummyLoanPosition.amount,
    maxRepayableAmount: dummyLoanPosition.amount - 500000n,
    currentLtv: 60,
    expectedLtv: 10,
    remainingDebt: dummyLoanPosition.amount - 1000000n,
    debtAssetPrice: {
      value: 170000000000n,
      decimals: 8,
    },
    collateralPrice: {
      value: 2500000000000n,
      decimals: 8,
    },
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Repay With Collateral',
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
