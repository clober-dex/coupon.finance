import { Currency } from './currency'

export type Asset = {
  underlying: Currency
  collaterals: Currency[]
  substitutes: Currency[]
}
