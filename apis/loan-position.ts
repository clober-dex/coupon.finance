import { LoanPosition } from '../model/loan-position'
import {
  Collateral,
  Epoch,
  getBuiltGraphSDK,
  Token,
  LoanPosition as GraphqlLoanPosition,
} from '../.graphclient'
import { LIQUIDATION_TARGET_LTV_PRECISION } from '../utils/ltv'
import { SUBGRAPH_URL } from '../constants/subgraph-url'
import { CHAIN_IDS } from '../constants/chain'

import { toCurrency } from './asset'

const { getLoanPositions, getLoanPosition } = getBuiltGraphSDK()

export async function fetchLoanPositions(
  chainId: CHAIN_IDS,
  userAddress: `0x${string}`,
): Promise<LoanPosition[]> {
  const { loanPositions } = await getLoanPositions(
    {
      userAddress: userAddress.toLowerCase(),
    },
    {
      url: SUBGRAPH_URL[chainId],
    },
  )
  return loanPositions.map((loanPosition) => toLoanPosition(loanPosition))
}

export async function fetchLoanPosition(
  chainId: CHAIN_IDS,
  positionId: bigint,
): Promise<LoanPosition | undefined> {
  const { loanPosition } = await getLoanPosition(
    {
      positionId: positionId.toString(),
    },
    {
      url: SUBGRAPH_URL[chainId],
    },
  )
  return loanPosition ? toLoanPosition(loanPosition) : undefined
}

function toLoanPosition(
  loanPosition: Pick<
    GraphqlLoanPosition,
    | 'id'
    | 'user'
    | 'amount'
    | 'liquidationRepaidAmount'
    | 'principal'
    | 'collateralAmount'
    | 'createdAt'
  > & {
    substitute: Pick<Token, 'id' | 'decimals' | 'name' | 'symbol'>
    underlying: Pick<Token, 'id' | 'decimals' | 'name' | 'symbol'>
    collateral: Pick<
      Collateral,
      | 'liquidationThreshold'
      | 'liquidationTargetLtv'
      | 'totalCollateralized'
      | 'totalBorrowed'
    > & {
      substitute: Pick<Token, 'id' | 'decimals' | 'name' | 'symbol'>
      underlying: Pick<Token, 'id' | 'decimals' | 'name' | 'symbol'>
    }
    fromEpoch: Pick<Epoch, 'id' | 'startTimestamp' | 'endTimestamp'>
    toEpoch: Pick<Epoch, 'id' | 'startTimestamp' | 'endTimestamp'>
  },
): LoanPosition {
  return {
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
      totalCollateralized: BigInt(loanPosition.collateral.totalCollateralized),
      totalBorrowed: BigInt(loanPosition.collateral.totalBorrowed),
    },
    interest: BigInt(loanPosition.amount) - BigInt(loanPosition.principal),
    amount: BigInt(loanPosition.amount),
    liquidationRepaidAmount: BigInt(loanPosition.liquidationRepaidAmount),
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
  }
}
