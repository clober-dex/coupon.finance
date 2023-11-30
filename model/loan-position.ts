import { Currency } from './currency'
import { Collateral } from './collateral'
import { Epoch } from './epoch'

export type LoanPosition = {
  id: bigint
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
  pnl?: number
  isPending: boolean
}

export const buildPendingPosition = (
  substitute: Currency,
  underlying: Currency,
  collateral: Collateral,
  interest: bigint,
  amount: bigint,
  collateralAmount: bigint,
  endTimestamp: number,
  currentTimestamp: number,
) => {
  return {
    id: -1n,
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
  } as LoanPosition
}
