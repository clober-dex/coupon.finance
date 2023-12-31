import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { DepositForm } from './deposit-form'

export default {
  title: 'Form/DepositForm',
  component: DepositForm,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof DepositForm>

type Story = StoryObj<typeof DepositForm>
export const Default: Story = {
  args: {
    depositCurrency: {
      address: '0x0000000000000000000000000000000000000003',
      name: 'WETH',
      symbol: 'WETH',
      decimals: 18,
    },
    maxDepositAmount: 10000000000000000000n,
    proceed: 1000000000000000000n,
    depositApy: 10,
    proceedsByEpochsDeposited: [
      { date: '23/12/31', proceeds: 1000000000000000000n },
      { date: '24/06/30', proceeds: 2000000000000000000n },
      { date: '24/12/31', proceeds: 3000000000000000000n },
      { date: '25/06/30', proceeds: 4000000000000000000n },
    ],
    value: '0.3',
    setValue: () => {},
    epochs: 2,
    setEpochs: () => {},
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Deposit',
    },
    depositAssetPrice: {
      value: 170000000000n,
      decimals: 8,
    },
  },
}

export const RemainingCoupons: Story = {
  args: {
    depositCurrency: {
      address: '0x0000000000000000000000000000000000000003',
      name: 'WETH',
      symbol: 'WETH',
      decimals: 18,
    },
    maxDepositAmount: 10000000000000000000n,
    proceed: 1000000000000000000n,
    depositApy: 10,
    proceedsByEpochsDeposited: [
      { date: '23/12/31', proceeds: 1000000000000000000n },
      { date: '24/06/30', proceeds: 2000000000000000000n },
      { date: '24/12/31', proceeds: 3000000000000000000n },
      { date: '25/06/30', proceeds: 4000000000000000000n },
    ],
    value: '0.3',
    setValue: () => {},
    epochs: 2,
    setEpochs: () => {},
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Deposit',
    },
    depositAssetPrice: {
      value: 170000000000n,
      decimals: 8,
    },
    remainingCoupons: [
      {
        date: '23/12/31',
        remainingCoupon: 1000000000000000000n,
        symbol: 'WaWETH-CP107',
      },
      {
        date: '24/06/30',
        remainingCoupon: 2000000000000000000n,
        symbol: 'WaWETH-CP108',
      },
    ],
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
