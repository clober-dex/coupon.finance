import { getAddress } from 'viem'

import { getBuiltGraphSDK } from '../.graphclient'
import { Asset } from '../model/asset'

const { getAssets } = getBuiltGraphSDK()

export async function fetchAssets(): Promise<Asset[]> {
  // TODO: Add caching
  const { assets } = await getAssets()

  return assets.map((asset) => ({
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
}
