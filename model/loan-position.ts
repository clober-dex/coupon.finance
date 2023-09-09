import { Currency } from './currency'
import { Collateral } from './collateral'
import { Epoch } from './epoch'

export type LoanPosition = {
  id: string
  substitute: Currency
  underlying: Currency
  collateral: Collateral
  interest: string
  amount: string
  collateralAmount: string
  fromEpoch: Epoch
  toEpoch: Epoch
  createdAt: number
}
