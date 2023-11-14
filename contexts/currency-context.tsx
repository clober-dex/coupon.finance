import React, { useCallback } from 'react'
import { useAccount, useBalance, useQuery } from 'wagmi'
import { readContracts } from '@wagmi/core'
import { getAddress } from 'viem'

import { IERC20__factory } from '../typechain'
import { fetchBalances, fetchCurrencies, fetchPrices } from '../apis/currency'
import { Currency } from '../model/currency'
import { fetchAssets, fetchAssetStatuses } from '../apis/asset'
import { fetchEpochs } from '../apis/epoch'
import { Asset, AssetStatus } from '../model/asset'
import { Epoch } from '../model/epoch'
import { Balances } from '../model/balances'
import { Prices } from '../model/prices'
import { max } from '../utils/bigint'
import { fetchMarkets } from '../apis/market'
import { formatDate } from '../utils/date'
import { fetchPoints } from '../apis/point'
import { getCurrentPoint } from '../utils/point'

import { useChainContext } from './chain-context'

type CurrencyContext = {
  coupons: {
    date: string
    balance: bigint
    marketAddress: `0x${string}`
    coupon: Currency
  }[]
  balances: Balances
  prices: Prices
  assets: Asset[]
  assetStatuses: AssetStatus[]
  epochs: Epoch[]
  point: bigint
  calculateETHValue: (currency: Currency, willPayAmount: bigint) => bigint
}

const Context = React.createContext<CurrencyContext>({
  coupons: [],
  balances: {},
  prices: {},
  assets: [],
  assetStatuses: [],
  epochs: [],
  point: 0n,
  calculateETHValue: () => 0n,
})

export const isEtherAddress = (address: `0x${string}`) => {
  return [
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    '0x4284186b053ACdBA28E8B26E99475d891533086a',
  ]
    .map((ethAddr) => getAddress(ethAddr))
    .includes(getAddress(address))
}

export const isEther = (currency: Currency) => {
  return isEtherAddress(currency.address)
}

export const CurrencyProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { address: userAddress } = useAccount()
  const { data: balance } = useBalance({ address: userAddress })
  const { selectedChain } = useChainContext()

  const { data: assets } = useQuery(
    ['assets', selectedChain],
    async () => {
      return fetchAssets(selectedChain.id)
    },
    {
      initialData: [],
    },
  )

  const { data: assetStatuses } = useQuery(
    ['assetStatuses', selectedChain],
    async () => {
      return fetchAssetStatuses(selectedChain.id)
    },
    {
      initialData: [],
    },
  )

  const { data: epochs } = useQuery(
    ['epochs', selectedChain],
    async () => {
      return fetchEpochs(selectedChain.id)
    },
    {
      initialData: [],
    },
  )

  const { data: currencies } = useQuery(
    ['currencies', selectedChain],
    async () => {
      return fetchCurrencies(selectedChain.id)
    },
    {
      initialData: [],
    },
  )

  const { data: prices } = useQuery(
    ['prices', currencies, selectedChain],
    async () => {
      return fetchPrices(
        selectedChain.id,
        currencies.map((currency) => currency.address),
      )
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
      return fetchBalances(
        selectedChain.id,
        userAddress,
        currencies.map((currency) => currency.address),
      )
    },
    {
      refetchInterval: 5 * 1000,
      refetchIntervalInBackground: true,
    },
  ) as { data: Balances }

  const { data: coupons } = useQuery(
    ['coupons', userAddress],
    async () => {
      if (!userAddress) {
        return []
      }
      const markets = await fetchMarkets(selectedChain.id)
      const results = await readContracts({
        contracts: markets.map(({ baseToken }) => ({
          address: baseToken.address,
          abi: IERC20__factory.abi,
          functionName: 'balanceOf',
          args: [userAddress],
        })),
      })
      return results.map(({ result }, index) => {
        const { address, baseToken, endTimestamp } = markets[index]
        return {
          date: formatDate(new Date(Number(endTimestamp) * 1000)),
          marketAddress: getAddress(address),
          coupon: baseToken,
          balance: result ?? 0n,
        }
      })
    },
    {
      refetchInterval: 5 * 1000,
      refetchIntervalInBackground: true,
    },
  ) as { data: CurrencyContext['coupons'] }

  const { data: point } = useQuery(
    ['point', selectedChain, userAddress],
    async () => {
      if (!userAddress) {
        return 0n
      }
      const points = await fetchPoints(selectedChain.id, userAddress)
      if (points.length === 0) {
        return 0n
      }
      return getCurrentPoint(points)
    },
    {
      refetchInterval: 5 * 1000,
      refetchIntervalInBackground: true,
    },
  )

  const calculateETHValue = useCallback(
    (currency: Currency, willPayAmount: bigint) => {
      if (!balance || !balances || !isEther(currency)) {
        return 0n
      }
      const wrappedETHBalance = balances[currency.address] - balance.value
      return max(willPayAmount - wrappedETHBalance, 0n)
    },
    [balance, balances],
  )

  return (
    <Context.Provider
      value={{
        coupons: coupons ?? [],
        prices: prices ?? {},
        balances: balances ?? {},
        assets: assets ?? [],
        assetStatuses: assetStatuses ?? [],
        epochs: epochs ?? [],
        point: point ?? 0n,
        calculateETHValue: calculateETHValue,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useCurrencyContext = () =>
  React.useContext(Context) as CurrencyContext
