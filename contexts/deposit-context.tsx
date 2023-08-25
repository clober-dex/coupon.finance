import React from 'react'

import { Currency } from '../model/currency'

type DepositContext = {
  // TODO: change to bigInt
  positions: {
    currency: Currency
    apy: string
    interestEarned: string
    deposited: string
    expiry: string
    price: string
  }[]
  apy: { [key in `0x${string}`]: number }
  available: { [key in `0x${string}`]: bigint }
  deposited: { [key in `0x${string}`]: bigint }
}

const Context = React.createContext<DepositContext>({
  positions: [],
  apy: {},
  available: {},
  deposited: {},
})

export const DepositProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const dummyPositions = [
    {
      currency: {
        address: '0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9' as `0x${string}`,
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
      apy: '5.00%',
      interestEarned: '3.45',
      deposited: '69.00',
      expiry: '12/12/2021',
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
      interestEarned: '2.1',
      deposited: '42.00',
      expiry: '12/12/2021',
      price: '30000.00',
    },
  ]

  // TODO: get apy from order book
  const apy: {
    [key in `0x${string}`]: number
  } = {}

  // TODO: get available
  const available: {
    [key in `0x${string}`]: bigint
  } = {}

  // TODO: get deposited
  const deposited: {
    [key in `0x${string}`]: bigint
  } = {}

  return (
    <Context.Provider
      value={{
        positions: dummyPositions,
        apy,
        available,
        deposited,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useDepositContext = () =>
  React.useContext(Context) as DepositContext
