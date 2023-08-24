import { getAddress } from 'viem'

import { getBuiltGraphSDK } from '../.graphclient'
import { Asset } from '../model/asset'

const { getAssets } = getBuiltGraphSDK()

let cache: Asset[] | null = null

export async function fetchAssets(): Promise<Asset[]> {
  if (cache) {
    return cache
  }
  const { assets } = await getAssets()

  const result = assets.map((asset) => ({
    underlying: {
      address: getAddress(asset.underlying.id),
      name: asset.underlying.name,
      symbol: asset.underlying.symbol,
      decimals: asset.underlying.decimals,
    },
    collaterals: asset.collaterals.map((collateral) => ({
      address: getAddress(collateral.id),
      name: collateral.name,
      symbol: collateral.symbol,
      decimals: collateral.decimals,
    })),
    substitutes: asset.substitutes.map((substitute) => ({
      address: getAddress(substitute.id),
      name: substitute.name,
      symbol: substitute.symbol,
      decimals: substitute.decimals,
    })),
  }))

  cache = result
  return result
}
