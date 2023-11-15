import { getAddress } from 'viem'

import { Collateral, getBuiltGraphSDK, Token } from '../.graphclient'
import { Asset, AssetStatus } from '../model/asset'
import { Market } from '../model/market'
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
        decimals: token.decimals,
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

export async function fetchAssetStatuses(
  chainId: CHAIN_IDS,
): Promise<AssetStatus[]> {
  const { assetStatuses } = await getAssetStatuses(
    {},
    {
      url: SUBGRAPH_URL[chainId],
    },
  )

  return assetStatuses.map((assetStatus) => {
    const epoch = {
      id: +assetStatus.epoch.id,
      startTimestamp: +assetStatus.market.epoch.startTimestamp,
      endTimestamp: +assetStatus.market.epoch.endTimestamp,
    }
    const market = Market.fromDto({
      address: getAddress(assetStatus.market.id),
      orderToken: getAddress(assetStatus.market.orderToken),
      couponId: assetStatus.market.couponId,
      takerFee: assetStatus.market.takerFee,
      quoteUnit: assetStatus.market.quoteUnit,
      epoch: {
        id: assetStatus.market.epoch.id,
        startTimestamp: assetStatus.market.epoch.startTimestamp,
        endTimestamp: assetStatus.market.epoch.endTimestamp,
      },
      quoteToken: {
        address: getAddress(assetStatus.market.quoteToken.id),
        name: assetStatus.market.quoteToken.name,
        symbol: assetStatus.market.quoteToken.symbol,
        decimals: assetStatus.market.quoteToken.decimals,
      },
      baseToken: {
        address: getAddress(assetStatus.market.baseToken.id),
        name: assetStatus.market.baseToken.name,
        symbol: assetStatus.market.baseToken.symbol,
        decimals: assetStatus.market.baseToken.decimals,
      },
      depths: assetStatus.market.depths.map((depth) => ({
        price: depth.price,
        rawAmount: depth.rawAmount,
        isBid: depth.isBid,
      })),
    })
    return {
      asset: toAsset(assetStatus.asset),
      epoch,
      totalDepositAvailable: market.totalBidsInBaseAfterFees(),
      totalDeposited: BigInt(assetStatus.totalDeposited),
      totalBorrowAvailable: market.totalAsksInBaseAfterFees(),
      totalBorrowed: BigInt(assetStatus.totalBorrowed),
      bestCouponBidPrice: Number(market.bids[0]?.price ?? 0n) / 1e18,
      bestCouponAskPrice: Number(market.asks[0]?.price ?? 0n) / 1e18,
    }
  })
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
