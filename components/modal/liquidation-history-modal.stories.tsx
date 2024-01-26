import { Meta, StoryObj } from '@storybook/react'
import '../../styles/globals.css'
import { zeroAddress } from 'viem'

import { LiquidationHistoryModal } from './liquidation-history-modal'

export default {
  title: 'Modal/LiquidationHistoryModal',
  component: LiquidationHistoryModal,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof LiquidationHistoryModal>

type Story = StoryObj<typeof LiquidationHistoryModal>

export const Default: Story = {
  args: {
    onClose: () => {},
    liquidationHistories: [
      {
        tx: '0x173cf53705de74943eb86ffe482071ecc7df80234857c275cbe9afd5d97b0a96',
        positionId: 1n,
        borrower: zeroAddress,
        underlying: {
          address: '0x0000000000000000000000000000000000000000',
          name: 'WETH',
          symbol: 'WETH',
          decimals: 18,
        },
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
        liquidatedCollateralAmount: 100000000000000n,
        repaidDebtAmount: 100000000000000n,
        collateralCurrencyPrice: {
          value: 170000000000n,
          decimals: 8,
        },
        debtCurrencyPrice: {
          value: 170000000000n,
          decimals: 8,
        },
        timestamp: 1630483200n,
      },
      {
        tx: '0x173cf53705de74943eb86ffe482071ecc7df80234857c275cbe9afd5d97b0a96',
        positionId: 1n,
        borrower: zeroAddress,
        underlying: {
          address: '0x0000000000000000000000000000000000000000',
          name: 'WETH',
          symbol: 'WETH',
          decimals: 18,
        },
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
        liquidatedCollateralAmount: 100000000000n,
        repaidDebtAmount: 1000000000000n,
        collateralCurrencyPrice: {
          value: 170000000000n,
          decimals: 8,
        },
        debtCurrencyPrice: {
          value: 170000000000n,
          decimals: 8,
        },
        timestamp: 1630483200n,
      },
    ],
    explorerUrl: 'https://etherscan.io',
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
