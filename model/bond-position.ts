import { Currency } from './currency'

export type BondPosition = {
  underlying: Currency
  interest: bigint
  amount: bigint
  expiryEpoch: bigint
  expiryTimestamp: bigint
}
