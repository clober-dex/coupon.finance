import { BigDecimal } from '../utils/numbers'

import { Currency } from './currency'
import { Collateral } from './collateral'
import { Epoch } from './epoch'

export type LoanPosition = {
  id: bigint
  user: `0x${string}`
  substitute: Currency
  underlying: Currency
  collateral: Collateral
  interest: bigint
  amount: bigint
  collateralAmount: bigint
  fromEpoch: Epoch
  toEpoch: Epoch
  createdAt: number
  updatedAt: number
  isLeverage: boolean
  borrowedCollateralAmount: bigint
  entryCollateralCurrencyPrice: BigDecimal
  averageCollateralCurrencyPrice: BigDecimal
  entryDebtCurrencyPrice: BigDecimal
  averageDebtCurrencyPrice: BigDecimal
  isPending: boolean
}

export const buildPendingPosition = (
  user: `0x${string}`,
  substitute: Currency,
  underlying: Currency,
  collateral: Collateral,
  interest: bigint,
  amount: bigint,
  collateralAmount: bigint,
  endTimestamp: number,
  currentTimestamp: number,
  isLeverage: boolean,
  borrowedCollateralAmount: bigint,
  entryCollateralCurrencyPrice: BigDecimal,
  averageCollateralCurrencyPrice: BigDecimal,
  entryDebtCurrencyPrice: BigDecimal,
  averageDebtCurrencyPrice: BigDecimal,
): LoanPosition => {
  return {
    id: -1n,
    user,
    substitute,
    underlying,
    collateral,
    interest,
    amount,
    collateralAmount,
    fromEpoch: {
      id: -1,
      startTimestamp: -1,
      endTimestamp: -1,
    },
    toEpoch: {
      id: -1,
      startTimestamp: -1,
      endTimestamp,
    },
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isPending: true,
    isLeverage,
    borrowedCollateralAmount,
    entryCollateralCurrencyPrice,
    averageCollateralCurrencyPrice,
    entryDebtCurrencyPrice,
    averageDebtCurrencyPrice,
  }
}
