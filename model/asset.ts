import { Currency } from './currency'
import { Collateral } from './collateral'
import { Epoch } from './epoch'

export type Asset = {
  underlying: Currency
  collaterals: Collateral[]
  substitutes: Currency[]
}

export type AssetStatus = {
  underlying: Currency
  epoch: Epoch
  totalAvailable: string
  totalDeposits: string
  bestCouponPrice: number
}
