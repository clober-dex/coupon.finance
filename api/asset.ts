import { getAddress } from 'viem'

import { getBuiltGraphSDK, Token } from '../.graphclient'
import { Asset } from '../model/asset'

const { getAssets } = getBuiltGraphSDK()

let cache: Asset[] | null = null

const toCurrency = (
  token: Pick<Token, 'id' | 'symbol' | 'name' | 'decimals'>,
) =>
  token.name === 'Wrapped Ether'
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
  const { assets } = await getAssets()

  const result = assets.map((asset) => ({
    underlying: toCurrency(asset.underlying),
    collaterals: asset.collaterals.map((collateral) => ({
      underlying: toCurrency(collateral.underlying),
      liquidationThreshold: collateral.liquidationThreshold,
      liquidationTargetLtv: collateral.liquidationTargetLtv,
    })),
    substitutes: asset.substitutes.map((substitute) => toCurrency(substitute)),
  }))

  cache = result
  return result
}
