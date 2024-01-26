import { BigDecimal } from '../utils/numbers'

import { Currency } from './currency'
import { Collateral } from './collateral'

export type LiquidationHistory = {
  tx: `0x${string}`
  positionId: bigint
  borrower: `0x${string}`
  underlying: Currency
  collateral: Collateral
  liquidatedCollateralAmount: bigint
  repaidDebtAmount: bigint
  collateralCurrencyPrice: BigDecimal
  debtCurrencyPrice: BigDecimal
  timestamp: bigint
}
