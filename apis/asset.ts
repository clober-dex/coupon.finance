import { getAddress } from 'viem'

import {
  AssetStatus as GraphqlAssetStatus,
  Book,
  Collateral,
  CouponMarket,
  Depth,
  Epoch,
  getBuiltGraphSDK,
  getIntegratedQuery,
  Maybe,
  Token,
} from '../.graphclient'
import { Asset, AssetStatus } from '../model/asset'
import { isEther } from '../contexts/currency-context'
import { LIQUIDATION_TARGET_LTV_PRECISION } from '../utils/ltv'
import { SUBGRAPH_URL } from '../constants/subgraph-url'
import { CHAIN_IDS } from '../constants/chain'
import { adjustCurrencyName, adjustCurrencySymbol } from '../utils/asset'
import { Market } from '../model/v2/market'

import { fetchMarkets } from './v2/market'

const { getAssets, getAssetStatuses } = getBuiltGraphSDK()

let cache: Asset[] | null = null

export const toCurrency = (
  token: Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'>,
) => {
  const currency = isEther({
    address: getAddress(token.id),
    ...token,
  })
    ? {
        address: getAddress(token.id),
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      }
    : {
        address: getAddress(token.id),
        name: token.name,
        symbol: token.symbol,
        decimals: Number(token.decimals),
      }
  return {
    ...currency,
    name: adjustCurrencyName(currency),
    symbol: adjustCurrencySymbol(currency),
  }
}

export async function fetchAssets(chainId: CHAIN_IDS): Promise<Asset[]> {
  if (cache) {
    return cache
  }
  const { assets } = await getAssets(
    {},
    {
      url: SUBGRAPH_URL[chainId],
    },
  )

  const result = assets.map((asset) => toAsset(asset))
  cache = result
  return result
}

export function extractAssets(integrated: getIntegratedQuery | null): Asset[] {
  if (cache) {
    return cache
  }
  if (!integrated) {
    return []
  }
  const { assets } = integrated

  const result = assets.map((asset) => toAsset(asset))
  cache = result
  return result
}

export async function fetchAssetStatuses(
  chainId: CHAIN_IDS,
): Promise<AssetStatus[]> {
  const { assetStatuses } = await getAssetStatuses(
    {},
    {
      url: SUBGRAPH_URL[chainId],
    },
  )
  const markets = await fetchMarkets(chainId)

  return assetStatuses.map((assetStatus) => toAssetStatus(assetStatus, markets))
}

export function extractAssetStatuses(
  integrated: getIntegratedQuery | null,
  markets: Market[] | null = [],
): AssetStatus[] {
  if (!integrated) {
    return []
  }
  const { assetStatuses } = integrated
  return assetStatuses.map((assetStatus) =>
    toAssetStatus(assetStatus, markets ?? []),
  )
}

function toAssetStatus(
  assetStatus: Pick<
    GraphqlAssetStatus,
    'id' | 'totalDeposited' | 'totalBorrowed'
  > & {
    asset: {
      underlying: Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'>
      substitutes: Array<Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'>>
      collaterals: Array<
        Pick<
          Collateral,
          | 'liquidationThreshold'
          | 'liquidationTargetLtv'
          | 'totalCollateralized'
          | 'totalBorrowed'
        > & {
          underlying: Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'>
          substitute: Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'>
        }
      >
    }
    epoch: Pick<Epoch, 'id' | 'startTimestamp' | 'endTimestamp'>
    couponMarkets: Array<
      Pick<CouponMarket, 'id' | 'sellMarketBookId' | 'buyMarketBookId'> & {
        substitute: Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'>
        underlying: Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'>
        epoch: Pick<Epoch, 'id' | 'startTimestamp' | 'endTimestamp'>
      }
    >
  },
  markets: Market[] = [],
): AssetStatus {
  const epoch = {
    id: +assetStatus.epoch.id,
    startTimestamp: +assetStatus.epoch.startTimestamp,
    endTimestamp: +assetStatus.epoch.endTimestamp,
  }
  const assetMarkets = markets.filter((market) =>
    assetStatus.couponMarkets.some((couponMarket) =>
      market.books.some(
        (book) => book.id === BigInt(couponMarket.buyMarketBookId),
      ),
    ),
  )
  const totalDepositAvailable = assetMarkets.reduce(
    (acc, market) => acc + market.totalBidsInBaseAfterFees(),
    0n,
  )
  const totalBorrowAvailable = assetMarkets.reduce(
    (acc, market) => acc + market.totalAsksInBaseAfterFees(),
    0n,
  )
  const bestCouponBidPrice = Math.max(
    ...assetMarkets.map((market) => Number(market.bids[0]?.price ?? 0n) / 1e18),
  )
  const bestCouponAskPrice = Math.min(
    ...assetMarkets.map((market) => Number(market.asks[0]?.price ?? 0n) / 1e18),
  )
  return {
    asset: toAsset(assetStatus.asset),
    epoch,
    totalDepositAvailable: totalDepositAvailable,
    totalDeposited: BigInt(assetStatus.totalDeposited),
    totalBorrowAvailable: totalBorrowAvailable,
    totalBorrowed: BigInt(assetStatus.totalBorrowed),
    bestCouponBidPrice: bestCouponBidPrice,
    bestCouponAskPrice: bestCouponAskPrice,
  }
}

function toAsset(asset: {
  underlying: Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'>
  substitutes: Array<Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'>>
  collaterals: Array<
    Pick<
      Collateral,
      | 'liquidationThreshold'
      | 'liquidationTargetLtv'
      | 'totalCollateralized'
      | 'totalBorrowed'
    > & {
      underlying: Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'>
      substitute: Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'>
    }
  >
}): Asset {
  return {
    underlying: toCurrency(asset.underlying),
    collaterals: asset.collaterals.map((collateral) => ({
      underlying: toCurrency(collateral.underlying),
      substitute: toCurrency(collateral.substitute),
      liquidationThreshold: BigInt(collateral.liquidationThreshold),
      liquidationTargetLtv: BigInt(collateral.liquidationTargetLtv),
      ltvPrecision: LIQUIDATION_TARGET_LTV_PRECISION,
      totalCollateralized: BigInt(collateral.totalCollateralized),
      totalBorrowed: BigInt(collateral.totalBorrowed),
    })),
    substitutes: asset.substitutes.map((substitute) => toCurrency(substitute)),
  }
}
