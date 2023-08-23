import React, { useCallback, useEffect } from 'react'
import { useQuery, useQueryClient } from 'wagmi'
import { readContracts } from '@wagmi/core'
import { getAddress, isAddressEqual } from 'viem'

import { Currency } from '../utils/currency'
import { fetchTokens } from '../api/token'
import { CONTRACT_ADDRESSES } from '../utils/addresses'
import { CouponOracle__factory, IERC20__factory } from '../typechain'

import { useWalletContext } from './wallet-context'

type TokenContext = {
  tokens: {
    currency: Currency
    balance: bigint
    price: number
  }[]
  invalidateUserBalances: () => void
}

const Context = React.createContext<TokenContext>({
  tokens: [],
  invalidateUserBalances: () => {},
})

export const TokenProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const queryClient = useQueryClient()
  const [tokens, setTokens] = React.useState<TokenContext['tokens']>([])

  const { userAddress } = useWalletContext()

  const { data: currencies } = useQuery(['currencies'], async () => {
    return fetchTokens()
  })

  const { data: prices } = useQuery(
    ['prices'],
    async () => {
      if (currencies) {
        const defaultSubstitutes = currencies.map(
          (token) =>
            token.substitutes && token.substitutes.length > 0
              ? token.substitutes[0].address
              : '', // revert to empty string if no substitutes
        )
        const [{ result: prices }, { result: decimals }] = await readContracts({
          contracts: [
            {
              address: CONTRACT_ADDRESSES.CouponOracle,
              abi: CouponOracle__factory.abi,
              functionName: 'getAssetsPrices',
              args: [defaultSubstitutes] as [`0x${string}`[]],
            },
            {
              address: CONTRACT_ADDRESSES.CouponOracle,
              abi: CouponOracle__factory.abi,
              functionName: 'decimals',
            },
          ],
        })

        const priceMap = new Map<`0x${string}`, number>()
        if (prices && decimals) {
          prices.forEach((price, index) => {
            const token = currencies.find(
              (token) =>
                token.substitutes &&
                token.substitutes.length > 0 &&
                isAddressEqual(
                  getAddress(token.substitutes[0].address),
                  getAddress(defaultSubstitutes[index]),
                ),
            )
            if (token) {
              priceMap.set(
                getAddress(token.address),
                Number(price) / 10 ** decimals,
              )
            }
          })
        }
        return priceMap
      }
    },
    {
      refetchInterval: 5 * 1000,
      refetchIntervalInBackground: true,
    },
  )

  const { data: balances } = useQuery(
    [
      'balances',
      {
        userAddress: userAddress,
      },
    ],
    async () => {
      const balanceMap = new Map<`0x${string}`, bigint>()
      if (currencies && userAddress) {
        const data = await readContracts({
          contracts: currencies.map((currency) => ({
            address: currency.address as `0x${string}`,
            abi: IERC20__factory.abi,
            functionName: 'balanceOf',
            args: [userAddress],
          })),
        })
        if (!data.find((d) => d.error)) {
          data.forEach(({ result: balance }, index) => {
            balanceMap.set(getAddress(currencies[index].address), balance || 0n)
          })
        }
      }
      return balanceMap
    },
  )

  const invalidateUserBalances = useCallback(() => {
    queryClient.invalidateQueries([
      'balances',
      {
        userAddress: userAddress,
      },
    ])
  }, [queryClient, userAddress])

  useEffect(() => {
    if (currencies && prices && prices.size > 0) {
      const _tokens = currencies.map((currency) => {
        const price = prices.get(getAddress(currency.address)) || 0
        const balance = balances?.get(getAddress(currency.address)) || 0n
        return {
          currency,
          balance,
          price,
        }
      })
      console.log('_tokens', _tokens)
      setTokens(_tokens)
    }
  }, [balances, currencies, prices])

  return (
    <Context.Provider
      value={{
        tokens: tokens || [],
        invalidateUserBalances,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useTokenContext = () => React.useContext(Context) as TokenContext
