import { Currency } from './currency'

export type BondPosition = {
  substitute: Currency
  underlying: Currency
  interest: bigint
  amount: bigint
  expiryEpoch: number
  expiryTimestamp: number
}
