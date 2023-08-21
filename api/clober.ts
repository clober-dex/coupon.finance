import { getAddress } from 'viem'

import { getBuiltGraphSDK } from '../.graphclient'
import { Currency } from '../utils/currency'

type Depth = {
  price: string
  baseAmount: string
  rawAmount: string
  isBid: boolean
}

type Market = {
  address: string
  orderToken: string
  a: string
  r: string
  d: string
  quoteToken: Currency
  baseToken: Currency
  depths: Depth[]
}

const { OrderBook } = getBuiltGraphSDK()

export async function fetchOrderBooks(): Promise<Market[]> {
  const { markets } = await OrderBook()
  return markets.map((market) => ({
    address: getAddress(market.id),
    orderToken: getAddress(market.orderToken),
    a: market.a,
    r: market.r,
    d: market.d,
    quoteToken: {
      address: getAddress(market.quoteToken.id),
      name: market.quoteToken.name,
      symbol: market.quoteToken.symbol,
      decimals: market.quoteToken.decimals,
      logo: `/assets/icons/icon-${market.quoteToken.symbol.toLowerCase()}.svg`,
    },
    baseToken: {
      address: getAddress(market.baseToken.id),
      name: market.baseToken.name,
      symbol: market.baseToken.symbol,
      decimals: market.baseToken.decimals,
      logo: `/assets/icons/icon-${market.baseToken.symbol.toLowerCase()}.svg`,
    },
    depths: market.depths.map((depth) => ({
      price: depth.price,
      baseAmount: depth.baseAmount,
      rawAmount: depth.rawAmount,
      isBid: depth.isBid,
    })),
  }))
}
