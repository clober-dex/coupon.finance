import { Market } from './market'

export type CouponBalance = {
  market: Market
  balance: bigint // erc20 + erc1155 balance
  assetValue: bigint
  erc20Balance: bigint
  erc1155Balance: bigint
}
