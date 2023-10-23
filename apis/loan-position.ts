import { LoanPosition } from '../model/loan-position'
import { getBuiltGraphSDK } from '../.graphclient'
import { LIQUIDATION_TARGET_LTV_PRECISION } from '../utils/ltv'

import { toCurrency } from './asset'

const { getLoanPositions } = getBuiltGraphSDK()

export async function fetchLoanPositions(
  userAddress: `0x${string}`,
): Promise<LoanPosition[]> {
  const { loanPositions } = await getLoanPositions(
    {
      userAddress: userAddress.toLowerCase(),
    },
    {
      url: process.env.SUBGRAPH_URL,
    },
  )
  return loanPositions.map((loanPosition) => ({
    id: BigInt(loanPosition.id),
    substitute: toCurrency(loanPosition.substitute),
    underlying: toCurrency(loanPosition.underlying),
    collateral: {
      underlying: toCurrency(loanPosition.collateral.underlying),
      substitute: toCurrency(loanPosition.collateral.substitute),
      liquidationThreshold: BigInt(
        loanPosition.collateral.liquidationThreshold,
      ),
      liquidationTargetLtv: BigInt(
        loanPosition.collateral.liquidationTargetLtv,
      ),
      ltvPrecision: LIQUIDATION_TARGET_LTV_PRECISION,
    },
    interest: BigInt(loanPosition.amount) - BigInt(loanPosition.principal),
    amount: BigInt(loanPosition.amount),
    collateralAmount: BigInt(loanPosition.collateralAmount),
    fromEpoch: {
      id: Number(loanPosition.fromEpoch.id),
      startTimestamp: Number(loanPosition.fromEpoch.startTimestamp),
      endTimestamp: Number(loanPosition.fromEpoch.endTimestamp),
    },
    toEpoch: {
      id: Number(loanPosition.toEpoch.id),
      startTimestamp: Number(loanPosition.toEpoch.startTimestamp),
      endTimestamp: Number(loanPosition.toEpoch.endTimestamp),
    },
    createdAt: Number(loanPosition.createdAt),
  }))
}
