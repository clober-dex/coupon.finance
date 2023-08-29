import { Currency } from './currency'

export type BondPosition = {
  underlying: Currency
  interest: bigint
  principal: bigint
  expiryEpoch: bigint
  expiryTimestamp: bigint
}
