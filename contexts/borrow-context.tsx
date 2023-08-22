import React from 'react'

import { Currency, CURRENCY_MAP } from '../utils/currency'

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
      currency: CURRENCY_MAP['ETH'],
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
      currency: CURRENCY_MAP['ARB'],
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
      currency: CURRENCY_MAP['USDC'],
      apy: '5.00%',
      available: '420.00',
      borrowed: '9000.00',
      liquidationThreshold: '60%',
      price: '1.00',
    },
    {
      currency: CURRENCY_MAP['ETH'],
      apy: '5.00%',
      available: '500.00',
      borrowed: '69.00',
      liquidationThreshold: '60%',
      price: '2000.00',
    },
    {
      currency: CURRENCY_MAP['ARB'],
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
