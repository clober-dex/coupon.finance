import { LoanPosition } from '../../model/loan-position'

export const dummyLoanPosition: LoanPosition = {
  id: 29n,
  underlying: {
    address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
  },
  substitute: {
    address: '0x3115f897469c8f395eb80dd921099b59046ae51e',
    name: 'Wrapped Aave Wrapped Ether',
    symbol: 'WaWETH',
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
    totalBorrowed: 12503898340000n,
  },
  amount: 1250389834000000000n,
  interest: 250389834000000000n,
  collateralAmount: 10000000n,
  fromEpoch: {
    id: 107,
    startTimestamp: 1688169600,
    endTimestamp: 1704067199,
  },
  toEpoch: {
    id: 108,
    startTimestamp: 1704067200,
    endTimestamp: 1719791999,
  },
  createdAt: 1694497281,
  updatedAt: 1694497281,
  isPending: false,
}
