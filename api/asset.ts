import { getAddress } from 'viem'

import { getBuiltGraphSDK, Token } from '../.graphclient'
import { Asset, AssetStatus } from '../model/asset'
import { Market } from '../model/market'
import { formatUnits } from '../utils/numbers'
import { isEthereum } from '../contexts/currency-context'

const { getAssets, getAssetStatuses } = getBuiltGraphSDK()

let cache: Asset[] | null = null

export const toCurrency = (
  token: Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'>,
) =>
  isEthereum({
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

export async function fetchAssets(): Promise<Asset[]> {
  if (cache) {
    return cache
  }
  const { assets } = await getAssets(
    {},
    {
      url: process.env.SUBGRAPH_URL,
    },
  )

  const result = assets.map((asset) => ({
    underlying: toCurrency(asset.underlying),
    collaterals: asset.collaterals.map((collateral) => ({
      underlying: toCurrency(collateral.underlying),
      substitute: toCurrency(collateral.substitute),
      liquidationThreshold: collateral.liquidationThreshold,
      liquidationTargetLtv: collateral.liquidationTargetLtv,
    })),
    substitutes: asset.substitutes.map((substitute) => toCurrency(substitute)),
  }))

  cache = result
  return result
}

export async function fetchAssetStatuses(): Promise<AssetStatus[]> {
  const { assetStatuses } = await getAssetStatuses(
    {},
    {
      url: process.env.SUBGRAPH_URL,
    },
  )

  return assetStatuses.map((assetStatus) => {
    const underlying = toCurrency(assetStatus.asset.underlying)
    const epoch = {
      id: +assetStatus.epoch.id,
      startTimestamp: +assetStatus.market.epoch.startTimestamp,
      endTimestamp: +assetStatus.market.epoch.endTimestamp,
    }
    const market = Market.fromDto({
      address: getAddress(assetStatus.market.id),
      orderToken: getAddress(assetStatus.market.orderToken),
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
    const decimals = assetStatus.asset.underlying.decimals
    const totalDepositAvailable = formatUnits(
      market.totalBidsInBaseAfterFees(),
      decimals,
    )
    const totalBorrowAvailable = formatUnits(
      market.totalAsksInBaseAfterFees(),
      decimals,
    )
    const totalDeposited = formatUnits(assetStatus.totalDeposited, decimals)
    const totalBorrowed = formatUnits(assetStatus.totalBorrowed, decimals)
    const bestCouponBidPrice = Number(market.bids[0]?.price ?? 0n) / 1e18
    const bestCouponAskPrice = Number(market.asks[0]?.price ?? 0n) / 1e18
    return {
      underlying,
      epoch,
      totalDepositAvailable,
      totalDeposited,
      totalBorrowAvailable,
      totalBorrowed,
      bestCouponBidPrice,
      bestCouponAskPrice,
    }
  })
}
