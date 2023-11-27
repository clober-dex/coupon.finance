import React, { useCallback, useMemo } from 'react'
import { useAccount, useQuery } from 'wagmi'
import { readContracts } from '@wagmi/core'
import { getAddress, zeroAddress } from 'viem'

import { fetchBalances, fetchCurrencies, fetchPrices } from '../apis/currency'
import { Currency } from '../model/currency'
import { extractAssets, extractAssetStatuses } from '../apis/asset'
import { extractEpochs } from '../apis/epoch'
import { Asset, AssetStatus } from '../model/asset'
import { Epoch } from '../model/epoch'
import { Balances } from '../model/balances'
import { Prices } from '../model/prices'
import { max } from '../utils/bigint'
import { fetchMarkets } from '../apis/market'
import { extractPoints } from '../apis/point'
import { getCurrentPoint } from '../utils/point'
import { CONTRACT_ADDRESSES } from '../constants/addresses'
import { CHAIN_IDS } from '../constants/chain'
import { ERC1155_ABI } from '../abis/@openzeppelin/erc1155-abi'
import { CouponBalance } from '../model/coupon-balance'
import { ERC20_PERMIT_ABI } from '../abis/@openzeppelin/erc20-permit-abi'

import { useChainContext } from './chain-context'
import { useSubgraphContext } from './subgraph-context'

type CurrencyContext = {
  coupons: CouponBalance[]
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

const REFRESH_INTERVAL = 5 * 1000

export const CurrencyProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { address: userAddress } = useAccount()
  const { selectedChain } = useChainContext()
  const { integrated, integratedPoint } = useSubgraphContext()

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
      refetchInterval: REFRESH_INTERVAL,
      refetchIntervalInBackground: true,
    },
  )

  const { data: balances } = useQuery(
    ['balances', userAddress, currencies],
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
      refetchInterval: REFRESH_INTERVAL,
      refetchIntervalInBackground: true,
    },
  ) as { data: Balances }

  const { data: coupons } = useQuery(
    ['coupons', userAddress],
    async () => {
      const markets = await fetchMarkets(selectedChain.id)
      if (!userAddress) {
        return markets.map((market) => ({
          market,
          balance: 0n,
          assetValue: 0n,
          erc20Balance: 0n,
          erc1155Balance: 0n,
        }))
      }
      const erc20Results = await readContracts({
        contracts: markets.map(({ baseToken }) => ({
          address: baseToken.address,
          abi: ERC20_PERMIT_ABI,
          functionName: 'balanceOf',
          args: [userAddress],
        })),
      })
      const erc1155Results = await readContracts({
        contracts: markets.map(({ couponId }) => ({
          address:
            CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].CouponManager,
          abi: ERC1155_ABI,
          functionName: 'balanceOf',
          args: [userAddress, couponId],
        })),
      })
      return erc20Results.map(({ result: erc20Balance }, index) => {
        const market = markets[index]
        const balance =
          (erc20Balance ?? 0n) + (erc1155Results[index].result ?? 0n)
        return {
          market,
          balance,
          assetValue: market.spend(market.baseToken.address, balance).amountOut,
          erc20Balance: erc20Balance ?? 0n,
          erc1155Balance: erc1155Results[index].result ?? 0n,
        }
      })
    },
    {
      refetchInterval: REFRESH_INTERVAL,
      refetchIntervalInBackground: true,
    },
  ) as { data: CurrencyContext['coupons'] }

  const calculateETHValue = useCallback(
    (currency: Currency, willPayAmount: bigint) => {
      if (!balances || !isEther(currency)) {
        return 0n
      }
      const wrappedETHBalance =
        balances[currency.address] - balances[zeroAddress]
      return max(willPayAmount - wrappedETHBalance, 0n)
    },
    [balances],
  )

  const assets = useMemo(() => extractAssets(integrated), [integrated])
  const assetStatuses = useMemo(
    () => extractAssetStatuses(integrated),
    [integrated],
  )
  const epochs = useMemo(() => extractEpochs(integrated), [integrated])
  const point = useMemo(() => {
    const points = extractPoints(integratedPoint)
    if (points.length === 0) {
      return 0n
    }
    return getCurrentPoint(points)
  }, [integratedPoint])

  return (
    <Context.Provider
      value={{
        coupons: coupons ?? [],
        prices: prices ?? {},
        balances: balances ?? {},
        assets: assets,
        assetStatuses: assetStatuses,
        epochs: epochs,
        point: point,
        calculateETHValue: calculateETHValue,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useCurrencyContext = () =>
  React.useContext(Context) as CurrencyContext
