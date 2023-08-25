import { Currency } from '../model/currency'

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
