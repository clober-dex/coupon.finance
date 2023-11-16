import { Currency } from './currency'
import { Epoch } from './epoch'

export type BondPosition = {
  tokenId: bigint
  substitute: Currency
  underlying: Currency
  interest: bigint
  amount: bigint
  fromEpoch: Epoch
  toEpoch: Epoch
  createdAt: number
  updatedAt: number
  isPending: boolean
}

export const buildPendingPosition = (
  substitute: Currency,
  underlying: Currency,
  interest: bigint,
  amount: bigint,
  endTimestamp: number,
  currentTimestamp: number,
) => {
  return {
    tokenId: -1n,
    substitute,
    underlying,
    interest,
    amount,
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
  } as BondPosition
}
