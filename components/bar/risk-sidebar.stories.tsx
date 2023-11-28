import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { RiskSidebar } from './risk-sidebar'

export default {
  title: 'Sidebar/RiskSidebar',
  component: RiskSidebar,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => {
    return (
      <div className="border border-solid border-gray-700">
        <RiskSidebar {...args} />
      </div>
    )
  },
} as Meta<typeof RiskSidebar>

type Story = StoryObj<typeof RiskSidebar>
export const Default: Story = {
  args: {
    chainExplorer: 'https://arbiscan.io',
    asset: {
      underlying: {
        address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        decimals: 8,
      },
      substitutes: [
        {
          address: '0xe494b0813d70e6b9501ddfceb2225d12b839422b',
          name: 'Wrapped Aave Wrapped BTC',
          symbol: 'WaWBTC',
          decimals: 8,
        },
      ],
      collaterals: [
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
    },
    prices: {
      '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f': {
        value: 2500000000000n,
        decimals: 8,
      },
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
