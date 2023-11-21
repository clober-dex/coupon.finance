import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'

import { GmxYieldForm } from './gmx-yield-form'

export default {
  title: 'GmxYieldForm',
  component: GmxYieldForm,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof GmxYieldForm>

type Story = StoryObj<typeof GmxYieldForm>
export const Default: Story = {
  args: {
    collateral1Currency: {
      address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
      name: 'Wrapped BTC',
      symbol: 'WBTC',
      decimals: 8,
    },
    collateral1Value: '42.42',
    setCollateral1Value: () => {},
    maxCollateral1Amount: 10000000000000000000n,
    collateral1Price: {
      value: 170000000000n,
      decimals: 8,
    },
    collateral2Currency: {
      address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
      name: 'Wrapped BTC',
      symbol: 'WBTC',
      decimals: 8,
    },
    collateral2Value: '42.42',
    setCollateral2Value: () => {},
    maxCollateral2Amount: 10000000000000000000n,
    collateral2Price: {
      value: 170000000000n,
      decimals: 8,
    },
    collateral3Currency: {
      address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
      name: 'Wrapped BTC',
      symbol: 'WBTC',
      decimals: 8,
    },
    collateral3Value: '42.42',
    setCollateral3Value: () => {},
    maxCollateral3Amount: 10000000000000000000n,
    collateral3Price: {
      value: 170000000000n,
      decimals: 8,
    },
    borrowCurrency: {
      address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
      name: 'Wrapped BTC',
      symbol: 'WBTC',
      decimals: 8,
    },
    borrowValue: '42.42',
    setBorrowValue: () => {},
    maxBorrowAmount: 10000000000000000000n,
    borrowPrice: {
      value: 170000000000n,
      decimals: 8,
    },
    interestsByEpochsBorrowed: [
      { date: '23/12/31', apy: 10 },
      { date: '24/06/30', apy: 20 },
      { date: '24/12/31', apy: 30 },
      { date: '25/06/30', apy: 40 },
    ],
    epochs: 3,
    setEpochs: () => {},
    borrowApy: 10.1,
    borrowLTV: 42.3,
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Confirm',
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
