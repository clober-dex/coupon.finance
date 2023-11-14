import { Currency } from './currency'
import { Collateral } from './collateral'
import { Epoch } from './epoch'

export type LoanPosition = {
  id: bigint
  substitute: Currency
  underlying: Currency
  collateral: Collateral
  interest: bigint
  amount: bigint
  liquidationRepaidAmount: bigint
  collateralAmount: bigint
  fromEpoch: Epoch
  toEpoch: Epoch
  createdAt: number
}
