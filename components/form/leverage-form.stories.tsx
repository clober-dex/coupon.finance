import React, { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { Currency } from '../../model/currency'

import { LeverageForm } from './leverage-form'

const MockedLeverageForm = ({ ...args }) => {
  const [borrowCurrency, setBorrowCurrency] = useState<Currency | undefined>(
    undefined,
  )
  return (
    <LeverageForm
      borrowCurrency={borrowCurrency}
      setBorrowCurrency={setBorrowCurrency}
      availableBorrowCurrencies={args.availableBorrowCurrencies}
      interest={args.interest}
      borrowApy={args.borrowApy}
      borrowLTV={args.borrowLTV}
      interestsByEpochsBorrowed={args.interestsByEpochsBorrowed}
      collateral={args.collateral}
      setCollateral={() => {}}
      availableCollaterals={[]}
      collateralValue={args.collateralValue}
      setCollateralValue={args.setCollateralValue}
      collateralAmount={args.collateralAmount}
      borrowValue={args.borrowValue}
      epochs={args.epochs}
      setEpochs={args.setEpochs}
      multiple={args.multiple}
      setMultiple={args.setMultiple}
      maxAvailableMultiple={args.maxAvailableMultiple}
      balances={args.balances}
      prices={args.prices}
      actionButtonProps={args.actionButtonProps}
    />
  )
}

export default {
  title: 'Form/LeverageForm',
  component: LeverageForm,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => <MockedLeverageForm {...args} />,
} as Meta<typeof LeverageForm>

type Story = StoryObj<typeof LeverageForm>
export const Default: Story = {
  args: {
    availableBorrowCurrencies: [
      {
        address: '0x0000000000000000000000000000000000000000',
        name: 'WETH',
        symbol: 'WETH',
        decimals: 18,
      },
    ],
    interest: 1000000000000000000n,
    borrowApy: 10,
    borrowLTV: 60,
    interestsByEpochsBorrowed: [
      { date: 'Nov 30 2023', apy: 10 },
      { date: 'Dec 31 2023', apy: 20 },
      { date: 'Jan 31 2024', apy: 30 },
      { date: 'Feb 29 2024', apy: 40 },
    ],
    collateral: {
      underlying: {
        address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        decimals: 8,
      },
      substitute: {
        address: '0xe494b0813d70e6b9501ddfceb2225d12b839422b',
        name: 'Wrapped Aave Wrapped BTC',
        symbol: 'WaWBTC',
        decimals: 8,
      },
      liquidationThreshold: 800000n,
      liquidationTargetLtv: 700000n,
      ltvPrecision: 1000000n,
      totalCollateralized: 10000000n,
      totalBorrowed: 100000000n,
    },
    collateralValue: '5',
    collateralAmount: 500000000000n,
    setCollateralValue: () => {},
    borrowValue: '1.1',
    epochs: 2,
    setEpochs: () => {},
    multiple: 3,
    setMultiple: () => {},
    maxAvailableMultiple: 8,
    balances: {
      '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f': 1000000000n,
    },
    prices: {
      '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f': {
        value: 3000000000000n,
        decimals: 8,
      },
      '0x0000000000000000000000000000000000000000': {
        value: 170000000000n,
        decimals: 8,
      },
    },
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Leverage',
    },
  },
}

export const SelectDebtAsset: Story = {
  args: {
    availableBorrowCurrencies: [
      {
        address: '0x0000000000000000000000000000000000000000',
        name: 'WETH',
        symbol: 'WETH',
        decimals: 18,
      },
      {
        address: '0x0000000000000000000000000000000000000000',
        name: 'WBTC',
        symbol: 'WBTC',
        decimals: 18,
      },
    ],
    interest: 1000000000000000000n,
    borrowApy: 10,
    borrowLTV: 60,
    interestsByEpochsBorrowed: [
      { date: 'Nov 30 2023', apy: 10 },
      { date: 'Dec 31 2023', apy: 20 },
      { date: 'Jan 31 2024', apy: 30 },
      { date: 'Feb 29 2024', apy: 40 },
    ],
    collateral: {
      underlying: {
        address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        decimals: 8,
      },
      substitute: {
        address: '0xe494b0813d70e6b9501ddfceb2225d12b839422b',
        name: 'Wrapped Aave Wrapped BTC',
        symbol: 'WaWBTC',
        decimals: 8,
      },
      liquidationThreshold: 800000n,
      liquidationTargetLtv: 700000n,
      ltvPrecision: 1000000n,
      totalCollateralized: 10000000n,
      totalBorrowed: 100000000n,
    },
    collateralValue: '5',
    collateralAmount: 500000000000n,
    setCollateralValue: () => {},
    borrowValue: '1.1',
    epochs: 2,
    setEpochs: () => {},
    multiple: 3,
    setMultiple: () => {},
    maxAvailableMultiple: 8,
    balances: {
      '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f': 1000000000n,
    },
    prices: {
      '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f': {
        value: 3000000000000n,
        decimals: 8,
      },
      '0x0000000000000000000000000000000000000000': {
        value: 170000000000n,
        decimals: 8,
      },
    },
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Leverage',
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
