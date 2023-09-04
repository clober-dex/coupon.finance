import { Currency } from './currency'

export type Collateral = {
  underlying: Currency
  substitute: Currency
  liquidationThreshold: string
  liquidationTargetLtv: string
}
