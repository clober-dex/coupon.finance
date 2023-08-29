import { Currency } from './currency'

export type Collateral = {
  underlying: Currency
  liquidationThreshold: bigint
  liquidationTargetLtv: bigint
}
