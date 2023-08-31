import { Currency } from './currency'

export type BondPosition = {
  tokenId: bigint
  substitute: Currency
  underlying: Currency
  interest: bigint
  amount: bigint
  expiryEpoch: number
  expiryTimestamp: number
}
