import React, { useCallback } from 'react'
import { useAccount, useQuery, useQueryClient } from 'wagmi'
import { readContracts } from '@wagmi/core'

import { CONTRACT_ADDRESSES } from '../utils/addresses'
import { CouponOracle__factory, IERC20__factory } from '../typechain'
import { BigDecimal } from '../utils/big-decimal'
import { fetchCurrencies } from '../api/currency'

type CurrencyContext = {
  balances: { [key in `0x${string}`]: BigDecimal }
  // contract address => token address => allowance
  allowances: {
    [key in `0x${string}`]: { [key in `0x${string}`]: BigDecimal }
  }
  prices: { [key in `0x${string}`]: BigDecimal }
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

export const CurrencyProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const queryClient = useQueryClient()

  const { address: userAddress } = useAccount()

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
              [currencyAddress]: BigDecimal.fromIntegerValue(
                decimals,
                val.toString(),
              ),
            }
          }, {})
        : {}
    },
    {
      refetchInterval: 5 * 1000,
      refetchIntervalInBackground: true,
    },
  )

  const { data: balances } = useQuery(['balances', userAddress], async () => {
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
        [currency.address]: BigDecimal.fromIntegerValue(
          currency.decimals,
          (result ?? 0n).toString(),
        ),
      }
    }, {})
  })

  const { data: allowance } = useQuery(
    ['allowances', userAddress],
    async () => {
      const currencies = await fetchCurrencies()
      const spenders = [
        CONTRACT_ADDRESSES.BorrowController,
        CONTRACT_ADDRESSES.DepositController,
        CONTRACT_ADDRESSES.OdosRepayAdapter,
      ]
      if (!userAddress) {
        return {}
      }
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
            [key in `0x${string}`]: { [key in `0x${string}`]: BigDecimal }
          },
          { result },
          i,
        ) => {
          const currency = currencies[i % currencies.length]
          const spender = spenders[Math.floor(i / currencies.length)]
          return {
            ...acc,
            [spender]: {
              ...acc[spender],
              [currency.address]: BigDecimal.fromIntegerValue(
                currency.decimals,
                (result ?? 0n).toString(),
              ),
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