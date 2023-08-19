import { getAddress } from 'viem'
import gql from 'graphql-tag'

import { execute } from '../.graphclient'

type DepthDto = {
  price: string
  amount: string
  isBid: boolean
}

type Depth = {
  price: string
  amount: string
  isBid: boolean
}

type TokenDto = {
  id: string
  symbol: string
  decimals: string
}

type Token = {
  address: string
  symbol: string
  decimals: string
}

type MarketDto = {
  id: string
  orderToken: string
  a: string
  r: string
  d: string
  quoteToken: TokenDto
  baseToken: TokenDto
  depths: DepthDto[]
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

export type MarketsDto = {
  data: {
    markets: MarketDto[]
  }
}

export async function fetchOrderBook(): Promise<Market[]> {
  const query = gql`
    {
      markets {
        id
        orderToken
        a
        r
        d
        quoteToken {
          id
          symbol
          decimals
        }
        baseToken {
          id
          symbol
          decimals
        }
        depths {
          price
          baseAmount
          isBid
        }
      }
    }
  `

  const { data } = (await execute(query, {})) as MarketsDto
  return data.markets.map((market) => ({
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
      amount: depth.amount,
      isBid: depth.isBid,
    })),
  }))
}
