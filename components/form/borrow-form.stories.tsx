import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { BorrowForm } from './borrow-form'

export default {
  title: 'Form/BorrowForm',
  component: BorrowForm,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof BorrowForm>

type Story = StoryObj<typeof BorrowForm>
export const Default: Story = {
  args: {
    isCollateralFixed: false,
    borrowCurrency: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'WETH',
      symbol: 'WETH',
      decimals: 18,
    },
    setBorrowCurrency: () => {},
    availableBorrowCurrencies: [
      {
        address: '0x0000000000000000000000000000000000000000',
        name: 'WETH',
        symbol: 'WETH',
        decimals: 18,
      },
    ],
    availableCollaterals: [
      {
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
    ],
    maxBorrowAmount: 0n,
    interest: 1000000000000000000n,
    borrowingFeePercentage: 3,
    borrowApy: 10,
    borrowLTV: 60,
    interestsByEpochsBorrowed: [
      { date: '23/12/31', apy: 10 },
      { date: '24/06/30', apy: 20 },
      { date: '24/12/31', apy: 30 },
      { date: '25/06/30', apy: 40 },
    ],
    collateral: undefined,
    setCollateral: () => {},
    collateralValue: '0',
    setCollateralValue: () => {},
    borrowValue: '1.1',
    setBorrowValue: () => {},
    epochs: 2,
    setEpochs: () => {},
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
    liquidationPrice: 2000,
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Borrow',
    },
  },
}

export const SelectedBoth: Story = {
  args: {
    isCollateralFixed: false,
    borrowCurrency: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'WETH',
      symbol: 'WETH',
      decimals: 18,
    },
    setBorrowCurrency: () => {},
    availableBorrowCurrencies: [
      {
        address: '0x0000000000000000000000000000000000000000',
        name: 'WETH',
        symbol: 'WETH',
        decimals: 18,
      },
    ],
    availableCollaterals: [
      {
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
    ],
    maxBorrowAmount: 0n,
    interest: 70000000000000000n,
    borrowingFeePercentage: 3,
    borrowApy: 10,
    borrowLTV: 3.3,
    interestsByEpochsBorrowed: [
      { date: '23/12/31', apy: 10 },
      { date: '24/06/30', apy: 20 },
      { date: '24/12/31', apy: 30 },
      { date: '25/06/30', apy: 40 },
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
    setCollateral: () => {},
    collateralValue: '5',
    setCollateralValue: () => {},
    borrowValue: '1.1',
    setBorrowValue: () => {},
    epochs: 2,
    setEpochs: () => {},
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
    liquidationPrice: 2000,
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Borrow',
    },
  },
}

export const Empty: Story = {
  args: {
    isCollateralFixed: false,
    setBorrowCurrency: () => {},
    availableBorrowCurrencies: [
      {
        address: '0x0000000000000000000000000000000000000000',
        name: 'WETH',
        symbol: 'WETH',
        decimals: 18,
      },
    ],
    availableCollaterals: [
      {
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
    ],
    maxBorrowAmount: 0n,
    interest: 70000000000000000n,
    borrowingFeePercentage: 3,
    borrowApy: 10,
    borrowLTV: 3.3,
    interestsByEpochsBorrowed: [
      { date: '23/12/31', apy: 10 },
      { date: '24/06/30', apy: 20 },
      { date: '24/12/31', apy: 30 },
      { date: '25/06/30', apy: 40 },
    ],
    setCollateral: () => {},
    collateralValue: '5',
    setCollateralValue: () => {},
    borrowValue: '1.1',
    setBorrowValue: () => {},
    epochs: 2,
    setEpochs: () => {},
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
    liquidationPrice: 2000,
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Borrow',
    },
  },
}

export const Full: Story = {
  args: {
    isCollateralFixed: false,
    borrowCurrency: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'WETH',
      symbol: 'WETH',
      decimals: 18,
    },
    setBorrowCurrency: () => {},
    availableBorrowCurrencies: [
      {
        address: '0x0000000000000000000000000000000000000000',
        name: 'WETH',
        symbol: 'WETH',
        decimals: 18,
      },
      {
        address: '0x0000000000000000000000000000000000000000',
        name: 'WETH',
        symbol: 'WETH',
        decimals: 18,
      },
    ],
    availableCollaterals: [
      {
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
      {
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
    maxBorrowAmount: 0n,
    interest: 70000000000000000n,
    borrowingFeePercentage: 3,
    borrowApy: 10,
    borrowLTV: 3.3,
    interestsByEpochsBorrowed: [
      { date: '23/12/31', apy: 10 },
      { date: '24/06/30', apy: 20 },
      { date: '24/12/31', apy: 30 },
      { date: '25/06/30', apy: 40 },
    ],
    setCollateral: () => {},
    collateralValue: '5',
    setCollateralValue: () => {},
    borrowValue: '1.1',
    setBorrowValue: () => {},
    epochs: 2,
    setEpochs: () => {},
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
    liquidationPrice: 2000,
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Borrow',
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
