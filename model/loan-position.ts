import { Currency } from './currency'
import { Collateral } from './collateral'

export type LoanPosition = {
  positionId: bigint
  substitute: Currency
  underlying: Currency
  collateral: Collateral
  interest: bigint
  amount: bigint
  collateralAmount: bigint
  expiryEpoch: number
  expiryTimestamp: number
  ltv: number
}
