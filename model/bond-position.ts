import { Currency } from './currency'
import { Epoch } from './epoch'

export type BondPosition = {
  tokenId: bigint
  substitute: Currency
  underlying: Currency
  interest: bigint
  amount: bigint
  fromEpoch: Epoch
  toEpoch: Epoch
  timestamp: number
}
