import React from 'react'

type DepositContext = {
  positions: {
    name: string
    symbol: string
    logo: string
    apy: string
    interestEarned: string
    deposited: string
    expiry: string
    price: string
  }[]
  assets: {
    name: string
    symbol: string
    logo: string
    apy: string
    available: string
    deposited: string
    price: string
  }[]
}

const Context = React.createContext<DepositContext>({
  positions: [],
  assets: [],
})

export const DepositProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const dummyPositions = [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
      apy: '5.00%',
      interestEarned: '3.45',
      deposited: '69.00',
      expiry: '12/12/2021',
      price: '2000.00',
    },
    {
      name: 'Wrapped Bitcoin',
      symbol: 'WBTC',
      logo: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png?1548822744',
      apy: '5.00%',
      interestEarned: '2.1',
      deposited: '42.00',
      expiry: '12/12/2021',
      price: '30000.00',
    },
  ]
  const dummyAssets = [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
      apy: '5.00%',
      available: '500.00',
      deposited: '69.00',
      price: '2000.00',
    },
    {
      name: 'Wrapped Bitcoin',
      symbol: 'WBTC',
      logo: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png?1548822744',
      apy: '5.00%',
      available: '50.00',
      deposited: '42.00',
      price: '30000.00',
    },
    {
      name: 'Tether USD',
      symbol: 'USDT',
      logo: 'https://assets.coingecko.com/coins/images/325/small/Tether-logo.png?1598003707',
      apy: '5.00%',
      available: '420.00',
      deposited: '9000.00',
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

export const useDepositContext = () =>
  React.useContext(Context) as DepositContext
