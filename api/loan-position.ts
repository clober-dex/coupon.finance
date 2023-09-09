import { LoanPosition } from '../model/loan-position'
import { getBuiltGraphSDK } from '../.graphclient'

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
    id: loanPosition.id,
    substitute: toCurrency(loanPosition.substitute),
    underlying: toCurrency(loanPosition.underlying),
    collateral: {
      underlying: toCurrency(loanPosition.collateral.underlying),
      substitute: toCurrency(loanPosition.collateral.substitute),
      liquidationThreshold: loanPosition.collateral.liquidationThreshold,
      liquidationTargetLtv: loanPosition.collateral.liquidationTargetLtv,
    },
    interest: (
      BigInt(loanPosition.amount) - BigInt(loanPosition.principal)
    ).toString(),
    amount: loanPosition.amount,
    collateralAmount: loanPosition.collateralAmount,
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
