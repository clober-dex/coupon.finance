import { Currency } from './currency'
import { Collateral } from './collateral'
import { Epoch } from './epoch'

export type LoanPosition = {
  positionId: bigint
  substitute: Currency
  underlying: Currency
  collateral: Collateral
  interest: bigint
  amount: bigint
  collateralAmount: bigint
  ltv: number
  fromEpoch: Epoch
  toEpoch: Epoch
  createdAt: number
}
