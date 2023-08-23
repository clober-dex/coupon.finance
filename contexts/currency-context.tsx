import React, { useCallback } from 'react'
import { useAccount, useQuery, useQueryClient } from 'wagmi'
import { readContracts } from '@wagmi/core'

import { fetchAssets } from '../api/token'
import { CONTRACT_ADDRESSES } from '../utils/addresses'
import { CouponOracle__factory, IERC20__factory } from '../typechain'
import { Currency } from '../model/currency'
import { DecimalNumber } from '../utils/decimal-number'
import { Asset } from '../model/asset'

type CurrencyContext = {
  assets: Asset[]
  balances: { [key in `0x${string}`]: DecimalNumber }
  // contract address => token address => allowance
  allowances: {
    [key in `0x${string}`]: { [key in `0x${string}`]: DecimalNumber }
  }
  prices: { [key in `0x${string}`]: DecimalNumber }
  invalidateBalances: () => void
  invalidateAllowances: () => void
}

const Context = React.createContext<CurrencyContext>({
  assets: [],
  balances: {},
  allowances: {},
  prices: {},
  invalidateBalances: () => {},
  invalidateAllowances: () => {},
})

export const CurrencyProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const queryClient = useQueryClient()

  const { address: userAddress } = useAccount()

  const { data: assets } = useQuery(
    ['assets'],
    async () => {
      return fetchAssets()
    },
    {
      refetchInterval: 1000,
      refetchIntervalInBackground: true,
    },
  )

  const fetchCurrencies = async () => {
    const assets = await fetchAssets()
    return Object.values<Currency>(
      assets
        .reduce(
          (acc: Currency[], asset) => [
            ...acc,
            asset.underlying,
            ...asset.collaterals,
          ],
          [],
        )
        .reduce((acc: { [key in `0x${string}`]: Currency }, currency) => {
          return {
            ...acc,
            [currency.address]: currency,
          }
        }, {}),
    )
  }

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
              [currencyAddress]: DecimalNumber.fromIntegerValue(
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
        [currency.address]: DecimalNumber.fromIntegerValue(
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
            [key in `0x${string}`]: { [key in `0x${string}`]: DecimalNumber }
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
              [currency.address]: DecimalNumber.fromIntegerValue(
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
        assets: assets ?? [],
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
