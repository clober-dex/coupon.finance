import React from 'react'

type BorrowContext = {
  positions: {
    name: string
    symbol: string
    logo: string
    apy: string
    borrowed: string
    collateral: string
    collateralSymbol: string
    expiry: string
    price: string
    collateralPrice: string
    ltv: string
    liquidationThreshold: string
  }[]
  assets: {
    name: string
    symbol: string
    logo: string
    apy: string
    available: string
    borrowed: string
    liquidationThreshold: string
    price: string
  }[]
}

const Context = React.createContext<BorrowContext>({
  positions: [],
  assets: [],
})

export const BorrowProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const dummyPositions = [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
      apy: '5.00%',
      borrowed: '69.00',
      collateral: '69.00',
      collateralSymbol: 'USDC',
      expiry: '12/12/2021',
      price: '2000.00',
      collateralPrice: '1.00',
      ltv: '50%',
      liquidationThreshold: '60%',
    },
    {
      name: 'Wrapped Bitcoin',
      symbol: 'WBTC',
      logo: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png?1548822744',
      apy: '5.00%',
      borrowed: '42.00',
      collateral: '42.00',
      collateralSymbol: 'USDC',
      deposited: '42.00',
      expiry: '12/12/2021',
      price: '30000.00',
      collateralPrice: '1.00',
      ltv: '50%',
      liquidationThreshold: '60%',
    },
  ]
  const dummyAssets = [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
      apy: '5.00%',
      available: '500.00',
      borrowed: '69.00',
      liquidationThreshold: '60%',
      price: '2000.00',
    },
    {
      name: 'Wrapped Bitcoin',
      symbol: 'WBTC',
      logo: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png?1548822744',
      apy: '5.00%',
      available: '50.00',
      borrowed: '42.00',
      liquidationThreshold: '60%',
      price: '30000.00',
    },
    {
      name: 'Tether USD',
      symbol: 'USDT',
      logo: 'https://assets.coingecko.com/coins/images/325/small/Tether-logo.png?1598003707',
      apy: '5.00%',
      available: '420.00',
      borrowed: '9000.00',
      liquidationThreshold: '60%',
      price: '1.00',
    },
  ]
  return (
    <Context.Provider
      value={{
        positions: dummyPositions,
        assets: dummyAssets,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useBorrowContext = () => React.useContext(Context) as BorrowContext
