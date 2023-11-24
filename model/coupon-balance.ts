import { Market } from './market'

export type CouponBalance = {
  market: Market
  balance: bigint
  assetValue: bigint
}
