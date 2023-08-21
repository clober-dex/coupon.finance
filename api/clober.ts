import { getAddress } from 'viem'

import { getBuiltGraphSDK } from '../.graphclient'

type Depth = {
  price: string
  amount: string
  isBid: boolean
}

type Token = {
  address: string
  symbol: string
  decimals: string
}

type Market = {
  address: string
  orderToken: string
  a: string
  r: string
  d: string
  quoteToken: Token
  baseToken: Token
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
      symbol: market.quoteToken.symbol,
      decimals: market.quoteToken.decimals,
    },
    baseToken: {
      address: getAddress(market.baseToken.id),
      symbol: market.baseToken.symbol,
      decimals: market.baseToken.decimals,
    },
    depths: market.depths.map((depth) => ({
      price: depth.price,
      amount: depth.baseAmount,
      isBid: depth.isBid,
    })),
  }))
}
