import { BondPosition } from '../model/bond-position'
import {
  BondPosition as GraphqlBondPosition,
  Epoch,
  getBuiltGraphSDK,
  getIntegratedPositionsQuery,
  Token,
} from '../.graphclient'
import { SUBGRAPH_URL } from '../constants/subgraph-url'
import { CHAIN_IDS } from '../constants/chain'

import { toCurrency } from './asset'
import { fetchPositionStatus } from './position-status'

const { getBondPosition, getBondPositions } = getBuiltGraphSDK()

const PAGE_SIZE = 1000

export async function fetchBondPositions(
  chainId: CHAIN_IDS,
): Promise<BondPosition[]> {
  const { totalBondPositionCount } = await fetchPositionStatus(chainId)
  const bondPositions = await Promise.all(
    Array.from({ length: Math.ceil(totalBondPositionCount / PAGE_SIZE) }).map(
      (_, index) =>
        getBondPositions({
          skip: index * PAGE_SIZE,
        }),
    ),
  )
  return bondPositions.reduce(
    (acc, { bondPositions }) =>
      acc.concat(
        bondPositions.map((bondPosition) => toBondPosition(bondPosition)),
      ),
    [] as BondPosition[],
  )
}

export function extractBondPositions(
  integratedPositions: getIntegratedPositionsQuery | undefined,
): BondPosition[] {
  if (!integratedPositions) {
    return []
  }
  const { bondPositions } = integratedPositions
  return bondPositions.map((bondPosition) => toBondPosition(bondPosition))
}

export async function fetchBondPosition(
  chainId: CHAIN_IDS,
  positionId: bigint,
): Promise<BondPosition | undefined> {
  const { bondPosition } = await getBondPosition(
    {
      positionId: positionId.toString(),
    },
    {
      url: SUBGRAPH_URL[chainId],
    },
  )
  return bondPosition ? toBondPosition(bondPosition) : undefined
}

function toBondPosition(
  bondPosition: Pick<
    GraphqlBondPosition,
    'id' | 'user' | 'amount' | 'createdAt' | 'updatedAt'
  > & {
    substitute: Pick<Token, 'id' | 'decimals' | 'name' | 'symbol'>
    underlying: Pick<Token, 'id' | 'decimals' | 'name' | 'symbol'>
    fromEpoch: Pick<Epoch, 'id' | 'startTimestamp' | 'endTimestamp'>
    toEpoch: Pick<Epoch, 'id' | 'startTimestamp' | 'endTimestamp'>
  },
): BondPosition {
  // TODO: implement principal calculation
  const principal = BigInt(bondPosition.amount)
  return {
    tokenId: BigInt(bondPosition.id),
    user: bondPosition.user as `0x${string}`,
    substitute: toCurrency(bondPosition.substitute),
    underlying: toCurrency(bondPosition.underlying),
    interest: BigInt(bondPosition.amount) - principal,
    amount: BigInt(bondPosition.amount),
    fromEpoch: {
      id: Number(bondPosition.fromEpoch.id),
      startTimestamp: Number(bondPosition.fromEpoch.startTimestamp),
      endTimestamp: Number(bondPosition.fromEpoch.endTimestamp),
    },
    toEpoch: {
      id: Number(bondPosition.toEpoch.id),
      startTimestamp: Number(bondPosition.toEpoch.startTimestamp),
      endTimestamp: Number(bondPosition.toEpoch.endTimestamp),
    },
    createdAt: Number(bondPosition.createdAt),
    updatedAt: Number(bondPosition.updatedAt),
    isPending: false,
  }
}
