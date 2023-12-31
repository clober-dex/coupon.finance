import { Currency } from './currency'
import { Collateral } from './collateral'
import { Epoch } from './epoch'

export type Asset = {
  underlying: Currency
  collaterals: Collateral[]
  substitutes: Currency[]
}

export type AssetStatus = {
  asset: Asset
  epoch: Epoch
  totalDepositAvailable: bigint
  totalDeposited: bigint
  totalBorrowAvailable: bigint
  totalBorrowed: bigint
  bestCouponBidPrice: number
  bestCouponAskPrice: number
}
