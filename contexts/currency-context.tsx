import React from 'react'
import { useAccount, useBalance, useQuery } from 'wagmi'
import { readContracts } from '@wagmi/core'

import { IERC20__factory } from '../typechain'
import { fetchCurrencies, fetchPrices } from '../api/currency'
import { Currency } from '../model/currency'
import { BigDecimal } from '../utils/numbers'

type CurrencyContext = {
  balances: { [key in `0x${string}`]: bigint }
  prices: { [key in `0x${string}`]: BigDecimal }
}

const Context = React.createContext<CurrencyContext>({
  balances: {},
  prices: {},
})

export const isEthereum = (currency: Currency) =>
  currency.name === 'Ethereum' &&
  currency.symbol === 'ETH' &&
  currency.decimals === 18

export const CurrencyProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { address: userAddress } = useAccount()
  const { data: balance } = useBalance({ address: userAddress })
  const { data: currencies } = useQuery(
    ['currencies'],
    async () => {
      return fetchCurrencies()
    },
    {
      initialData: [],
    },
  )

  const { data: prices } = useQuery(
    ['prices', currencies],
    async () => {
      const currencyAddresses = currencies.map((currency) => currency.address)
      return fetchPrices(currencyAddresses)
    },
    {
      refetchInterval: 5 * 1000,
      refetchIntervalInBackground: true,
    },
  )

  const { data: balances } = useQuery(
    ['balances', userAddress, balance, currencies],
    async () => {
      if (!userAddress) {
        return {}
      }
      const results = await readContracts({
        contracts: currencies.map((currency) => ({
          address: currency.address,
          abi: IERC20__factory.abi,
          functionName: 'balanceOf',
          args: [userAddress],
        })),
      })
      return results.reduce((acc, { result }, i) => {
        const currency = currencies[i]
        return {
          ...acc,
          [currency.address]: isEthereum(currency)
            ? (result ?? 0n) + (balance?.value ?? 0n)
            : result,
        }
      }, {})
    },
    {
      refetchOnWindowFocus: true,
    },
  )

  return (
    <Context.Provider
      value={{
        prices: prices ?? {},
        balances: balances ?? {},
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useCurrencyContext = () =>
  React.useContext(Context) as CurrencyContext
