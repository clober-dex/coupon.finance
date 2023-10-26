import React, { useCallback } from 'react'
import { useAccount, useBalance, useNetwork, useQuery } from 'wagmi'
import { readContracts } from '@wagmi/core'
import { getAddress } from 'viem'

import { IERC20__factory } from '../typechain'
import { fetchCurrencies, fetchPrices } from '../apis/currency'
import { Currency } from '../model/currency'
import { fetchAssets, fetchAssetStatuses } from '../apis/asset'
import { fetchEpochs } from '../apis/epoch'
import { Asset, AssetStatus } from '../model/asset'
import { Epoch } from '../model/epoch'
import { Balances } from '../model/balances'
import { Prices } from '../model/prices'
import { max } from '../utils/bigint'

type CurrencyContext = {
  balances: Balances
  prices: Prices
  assets: Asset[]
  assetStatuses: AssetStatus[]
  epochs: Epoch[]
  calculateETHValue: (currency: Currency, willPayAmount: bigint) => bigint
}

const Context = React.createContext<CurrencyContext>({
  balances: {},
  prices: {},
  assets: [],
  assetStatuses: [],
  epochs: [],
  calculateETHValue: () => 0n,
})

export const isEthereum = (currency: Currency) => {
  return [
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    '0x4284186b053ACdBA28E8B26E99475d891533086a',
  ]
    .map((address) => getAddress(address))
    .includes(getAddress(currency.address))
}

export const CurrencyProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { address: userAddress } = useAccount()
  const { data: balance } = useBalance({ address: userAddress })
  const { chain } = useNetwork()

  const { data: assets } = useQuery(
    ['assets', chain],
    async () => {
      return chain ? fetchAssets(chain.id) : []
    },
    {
      initialData: [],
    },
  )

  const { data: assetStatuses } = useQuery(
    ['assetStatuses', chain],
    async () => {
      return chain ? fetchAssetStatuses(chain.id) : []
    },
    {
      initialData: [],
    },
  )

  const { data: epochs } = useQuery(
    ['epochs', chain],
    async () => {
      return chain ? fetchEpochs(chain.id) : []
    },
    {
      initialData: [],
    },
  )

  const { data: currencies } = useQuery(
    ['currencies', chain],
    async () => {
      return chain ? fetchCurrencies(chain.id) : []
    },
    {
      initialData: [],
    },
  )

  const { data: prices } = useQuery(
    ['prices', currencies, chain],
    async () => {
      return chain
        ? fetchPrices(
            chain.id,
            currencies.map((currency) => currency.address),
          )
        : ({} as Prices)
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
      return results.reduce((acc, { result }, index) => {
        const currency = currencies[index]
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
  ) as { data: Balances }

  const calculateETHValue = useCallback(
    (currency: Currency, willPayAmount: bigint) => {
      if (!balance || !balances || !isEthereum(currency)) {
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
        prices: prices ?? {},
        balances: balances ?? {},
        assets: assets ?? [],
        assetStatuses: assetStatuses ?? [],
        epochs: epochs ?? [],
        calculateETHValue: calculateETHValue,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useCurrencyContext = () =>
  React.useContext(Context) as CurrencyContext
