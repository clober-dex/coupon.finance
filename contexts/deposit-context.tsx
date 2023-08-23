import React from 'react'
import { useQuery } from 'wagmi'

import { fetchOrderBooks } from '../api/clober'
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
  assets: {
    currency: Currency
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
  const { data: orderbook } = useQuery(
    ['orderbook'],
    async () => {
      return fetchOrderBooks()
    },
    {
      refetchInterval: 1000,
    },
  )
  console.log(orderbook)

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
      deposited: '9000.00',
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
      deposited: '69.00',
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
      deposited: '42.00',
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

export const useDepositContext = () =>
  React.useContext(Context) as DepositContext
