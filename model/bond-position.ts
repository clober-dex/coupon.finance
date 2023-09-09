import { Currency } from './currency'
import { Epoch } from './epoch'

export type BondPosition = {
  tokenId: string
  substitute: Currency
  underlying: Currency
  interest: string
  amount: string
  fromEpoch: Epoch
  toEpoch: Epoch
  createdAt: number
}
