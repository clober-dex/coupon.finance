import { Currency } from './currency'
import { Collateral } from './collateral'

export type Asset = {
  underlying: Currency
  collaterals: Collateral[]
  substitutes: Currency[]
}
