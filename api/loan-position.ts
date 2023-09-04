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
    positionId: BigInt(loanPosition.id),
    substitute: toCurrency(loanPosition.substitute),
    underlying: toCurrency(loanPosition.underlying),
    collateral: {
      underlying: toCurrency(loanPosition.collateral.underlying),
      substitute: toCurrency(loanPosition.collateral.substitute),
      liquidationThreshold: loanPosition.collateral.liquidationThreshold,
      liquidationTargetLtv: loanPosition.collateral.liquidationTargetLtv,
    },
    interest: BigInt(loanPosition.amount) - BigInt(loanPosition.principal),
    amount: BigInt(loanPosition.amount),
    collateralAmount: BigInt(loanPosition.collateralAmount),
    expiryEpoch: Number(loanPosition.toEpoch.id),
    expiryTimestamp: Number(loanPosition.toEpoch.endTimestamp),
    ltv: Number(loanPosition.ltv),
  }))
}
