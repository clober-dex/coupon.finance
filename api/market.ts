import { getAddress } from 'viem'

import { getBuiltGraphSDK } from '../.graphclient'
import { Market } from '../model/market'
import { Currency } from '../model/currency'

const { getMarkets } = getBuiltGraphSDK()

type DepthDto = {
  price: string
  rawAmount: string
  isBid: boolean
}

export type MarketDto = {
  address: string
  orderToken: string
  takerFee: string
  quoteUnit: string
  epoch: string
  startTimestamp: string
  endTimestamp: string
  quoteToken: Currency
  baseToken: Currency
  depths: DepthDto[]
}
export async function fetchMarkets(): Promise<Market[]> {
  const { markets } = await getMarkets()
  return markets.map((market) =>
    Market.fromDto({
      address: getAddress(market.id),
      orderToken: getAddress(market.orderToken),
      takerFee: market.takerFee,
      quoteUnit: market.quoteUnit,
      epoch: market.epoch,
      startTimestamp: market.startTimestamp,
      endTimestamp: market.endTimestamp,
      quoteToken: {
        address: getAddress(market.quoteToken.id),
        name: market.quoteToken.name,
        symbol: market.quoteToken.symbol,
        decimals: market.quoteToken.decimals,
      },
      baseToken: {
        address: getAddress(market.baseToken.id),
        name: market.baseToken.name,
        symbol: market.baseToken.symbol,
        decimals: market.baseToken.decimals,
      },
      depths: market.depths.map((depth) => ({
        price: depth.price,
        rawAmount: depth.rawAmount,
        isBid: depth.isBid,
      })),
    }),
  )
}
