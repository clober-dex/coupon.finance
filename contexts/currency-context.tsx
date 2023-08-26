import React, { useCallback } from 'react'
import { useAccount, useBalance, useQuery, useQueryClient } from 'wagmi'
import { readContracts } from '@wagmi/core'

import { CONTRACT_ADDRESSES } from '../utils/addresses'
import { CouponOracle__factory, IERC20__factory } from '../typechain'
import { fetchCurrencies } from '../api/currency'
import { Currency } from '../model/currency'

type CurrencyContext = {
  balances: { [key in `0x${string}`]: bigint }
  // contract address => token address => allowance
  allowances: { [key in `0x${string}`]: { [key in `0x${string}`]: bigint } }
  prices: { [key in `0x${string}`]: number }
  invalidateBalances: () => void
  invalidateAllowances: () => void
}

const Context = React.createContext<CurrencyContext>({
  balances: {},
  allowances: {},
  prices: {},
  invalidateBalances: () => {},
  invalidateAllowances: () => {},
})

export const isEthereum = (currency: Currency) =>
  currency.name === 'Ethereum' &&
  currency.symbol === 'ETH' &&
  currency.decimals === 18

export const CurrencyProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const queryClient = useQueryClient()

  const { address: userAddress } = useAccount()
  const { data: balance } = useBalance({ address: userAddress })
  const { data: currencies } = useQuery(['currencies'], async () => {
    return fetchCurrencies()
  })

  const { data: prices } = useQuery(
    ['prices'],
    async () => {
      const currencyAddresses = (currencies || []).map(
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
      if (!userAddress || !currencies) {
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

  const { data: allowance } = useQuery(
    ['allowances', userAddress],
    async () => {
      if (!userAddress || !currencies) {
        return {}
      }
      const spenders = [
        CONTRACT_ADDRESSES.BorrowController,
        CONTRACT_ADDRESSES.DepositController,
        CONTRACT_ADDRESSES.OdosRepayAdapter,
      ]
      const contracts = spenders
        .map((spender) => {
          return currencies.map((currency) => ({
            address: currency.address,
            abi: IERC20__factory.abi,
            functionName: 'allowance',
            args: [userAddress, spender],
          }))
        }, [])
        .flat()
      const results = await readContracts({
        contracts,
      })
      return results.reduce(
        (
          acc: {
            [key in `0x${string}`]: { [key in `0x${string}`]: bigint }
          },
          { result },
          i,
        ) => {
          const currency = currencies[i % currencies.length]
          const spender = spenders[Math.floor(i / currencies.length)]
          const resultValue = (result ?? 0n) as bigint
          return {
            ...acc,
            [spender]: {
              ...acc[spender],
              [currency.address]: isEthereum(currency)
                ? resultValue + (balance?.value ?? 0n)
                : resultValue,
            },
          }
        },
        spenders.reduce((acc, spender) => ({ ...acc, [spender]: {} }), {}),
      )
    },
  )

  const invalidateBalances = useCallback(async () => {
    await queryClient.invalidateQueries(['balances', userAddress])
  }, [queryClient, userAddress])

  const invalidateAllowances = useCallback(async () => {
    await queryClient.invalidateQueries(['allowances', userAddress])
  }, [queryClient, userAddress])

  return (
    <Context.Provider
      value={{
        prices: prices ?? {},
        balances: balances ?? {},
        allowances: allowance ?? {},
        invalidateBalances,
        invalidateAllowances,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useCurrencyContext = () =>
  React.useContext(Context) as CurrencyContext
