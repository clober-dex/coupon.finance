import { Currency } from '../model/currency'

type DepthDto = {
  price: string
  rawAmount: string
  isBid: boolean
}

export type MarketDto = {
  address: string
  orderToken: string
  a: string
  r: string
  d: string
  takerFee: string
  makerFee: string
  quoteUnit: string
  quoteToken: Currency
  baseToken: Currency
  depths: DepthDto[]
}
