import { Currency } from './currency'

export type Collateral = {
  underlying: Currency
  substitute: Currency
  liquidationThreshold: bigint
  liquidationTargetLtv: bigint
  ltvPrecision: bigint
  totalCollateralized: bigint
  totalBorrowed: bigint
}
