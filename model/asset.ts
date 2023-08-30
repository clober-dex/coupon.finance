import { Currency } from './currency'
import { Collateral } from './collateral'

export type Asset = {
  underlying: Currency
  collaterals: Collateral[]
  substitutes: Currency[]
}

export type AssetStatus = {
  underlying: Currency
  epochId: number
  totalAvailable: string
  totalDeposits: string
  bestCouponPrice: number
}
