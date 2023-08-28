import React, { useCallback } from 'react'
import { useAccount, useBalance, useQuery, useQueryClient } from 'wagmi'
import { readContracts } from '@wagmi/core'

import { CONTRACT_ADDRESSES } from '../utils/addresses'
import { CouponOracle__factory, IERC20__factory } from '../typechain'
import { fetchCurrencies } from '../api/currency'
import { Currency } from '../model/currency'

type CurrencyContext = {
  balances: { [key in `0x${string}`]: bigint }
  prices: { [key in `0x${string}`]: number }
  invalidateBalances: () => void
}

const Context = React.createContext<CurrencyContext>({
  balances: {},
  prices: {},
  invalidateBalances: () => {},
})

export const isEthereum = (currency: Currency) =>
  currency.name === 'Ethereum' &&
  currency.symbol === 'ETH' &&
  currency.decimals === 18

export const CurrencyProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const queryClient = useQueryClient()

  const { address: userAddress } = useAccount()
  const { data: balance } = useBalance({ address: userAddress })

  const { data: prices } = useQuery(
    ['prices'],
    async () => {
      const currencyAddresses = (await fetchCurrencies()).map(
        (currency) => currency.address,
      )
      const [{ result: prices }, { result: decimals }] = await readContracts({
        contracts: [
          {
            address: CONTRACT_ADDRESSES.CouponOracle,
            abi: CouponOracle__factory.abi,
            functionName: 'getAssetsPrices',
            args: [currencyAddresses],
          },
          {
            address: CONTRACT_ADDRESSES.CouponOracle,
            abi: CouponOracle__factory.abi,
            functionName: 'decimals',
          },
        ],
      })
      return prices && decimals
        ? prices.reduce((acc, val, i) => {
            const currencyAddress = currencyAddresses[i]
            return {
              ...acc,
              [currencyAddress]: Number(val) / 10 ** decimals,
            }
          }, {})
        : {}
    },
    {
      refetchInterval: 5 * 1000,
      refetchIntervalInBackground: true,
    },
  )

  const { data: balances } = useQuery(
    ['balances', userAddress, balance],
    async () => {
      const currencies = await fetchCurrencies()
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

  const invalidateBalances = useCallback(async () => {
    await queryClient.invalidateQueries(['balances', userAddress])
  }, [queryClient, userAddress])

  return (
    <Context.Provider
      value={{
        prices: prices ?? {},
        balances: balances ?? {},
        invalidateBalances,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useCurrencyContext = () =>
  React.useContext(Context) as CurrencyContext
