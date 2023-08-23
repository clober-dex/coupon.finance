import React from 'react'

import { Currency } from '../model/currency'

type BorrowContext = {
  // TODO: change to bigInt
  positions: {
    currency: Currency
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
    currency: Currency
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
      currency: {
        address: '0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9' as `0x${string}`,
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
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
      currency: {
        address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' as `0x${string}`,
        name: 'Arbitrum',
        symbol: 'ARB',
        decimals: 18,
      },
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
      currency: {
        address: '0xA8CE8aee21bC2A48a5EF670afCc9274C7bbbC035' as `0x${string}`,
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      apy: '5.00%',
      available: '420.00',
      borrowed: '9000.00',
      liquidationThreshold: '60%',
      price: '1.00',
    },
    {
      currency: {
        address: '0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9' as `0x${string}`,
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
      apy: '5.00%',
      available: '500.00',
      borrowed: '69.00',
      liquidationThreshold: '60%',
      price: '2000.00',
    },
    {
      currency: {
        address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' as `0x${string}`,
        name: 'Arbitrum',
        symbol: 'ARB',
        decimals: 18,
      },
      apy: '5.00%',
      available: '50.00',
      borrowed: '42.00',
      liquidationThreshold: '60%',
      price: '1.20',
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
