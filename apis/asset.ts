import { getAddress } from 'viem'

import {
  AssetStatus as GraphqlAssetStatus,
  Collateral,
  Epoch,
  getBuiltGraphSDK,
  getIntegratedQuery,
  Token,
} from '../.graphclient'
import { Asset, AssetStatus } from '../model/asset'
import { isEther } from '../contexts/currency-context'
import { LIQUIDATION_TARGET_LTV_PRECISION } from '../utils/ltv'
import { SUBGRAPH_URL } from '../constants/subgraph-url'
import { CHAIN_IDS } from '../constants/chain'
import { adjustCurrencyName, adjustCurrencySymbol } from '../utils/asset'

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

  return assetStatuses.map((assetStatus) => toAssetStatus(assetStatus))
}

export function extractAssetStatuses(
  integrated: getIntegratedQuery | null,
): AssetStatus[] {
  if (!integrated) {
    return []
  }
  const { assetStatuses } = integrated
  return assetStatuses.map((assetStatus) => toAssetStatus(assetStatus))
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
  },
): AssetStatus {
  const epoch = {
    id: +assetStatus.epoch.id,
    startTimestamp: +assetStatus.epoch.startTimestamp,
    endTimestamp: +assetStatus.epoch.endTimestamp,
  }
  return {
    asset: toAsset(assetStatus.asset),
    epoch,
    totalDepositAvailable: 0n, // TODO: implement
    totalDeposited: BigInt(assetStatus.totalDeposited),
    totalBorrowAvailable: 0n, // TODO: implement
    totalBorrowed: BigInt(assetStatus.totalBorrowed),
    bestCouponBidPrice: 0, // TODO: implement
    bestCouponAskPrice: 0, // TODO: implement
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
