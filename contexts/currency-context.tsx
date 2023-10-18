import React from 'react'
import { useAccount, useBalance, useQuery } from 'wagmi'
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

type CurrencyContext = {
  balances: Balances
  prices: Prices
  assets: Asset[]
  assetStatuses: AssetStatus[]
  epochs: Epoch[]
}

const Context = React.createContext<CurrencyContext>({
  balances: {},
  prices: {},
  assets: [],
  assetStatuses: [],
  epochs: [],
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

  const { data: assets } = useQuery(
    ['assets'],
    async () => {
      return fetchAssets()
    },
    {
      initialData: [],
    },
  )

  const { data: assetStatuses } = useQuery(
    ['assetStatuses'],
    async () => {
      return fetchAssetStatuses()
    },
    {
      initialData: [],
    },
  )

  const { data: epochs } = useQuery(
    ['epochs'],
    async () => {
      return fetchEpochs()
    },
    {
      initialData: [],
    },
  )

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
        assets: assets ?? [],
        assetStatuses: assetStatuses ?? [],
        epochs: epochs ?? [],
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useCurrencyContext = () =>
  React.useContext(Context) as CurrencyContext
