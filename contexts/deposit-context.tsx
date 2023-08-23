import React from 'react'
import { useQuery } from 'wagmi'

import { Currency, CURRENCY_MAP } from '../utils/currency'
import { fetchOrderBooks } from '../api/clober'

type DepositContext = {
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
      currency: CURRENCY_MAP['ETH'],
      apy: '5.00%',
      interestEarned: '3.45',
      deposited: '69.00',
      expiry: '12/12/2021',
      price: '2000.00',
    },
    {
      currency: CURRENCY_MAP['ARB'],
      apy: '5.00%',
      interestEarned: '2.1',
      deposited: '42.00',
      expiry: '12/12/2021',
      price: '30000.00',
    },
  ]
  const dummyAssets = [
    {
      currency: CURRENCY_MAP['USDC'],
      apy: '5.00%',
      available: '420.00',
      deposited: '9000.00',
      price: '1.00',
    },
    {
      currency: CURRENCY_MAP['ETH'],
      apy: '5.00%',
      available: '500.00',
      deposited: '69.00',
      price: '2000.00',
    },
    {
      currency: CURRENCY_MAP['ARB'],
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
