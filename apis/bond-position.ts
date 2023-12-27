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

const { getBondPosition, getBondPositions } = getBuiltGraphSDK()

export async function fetchBondPositions(
  chainId: CHAIN_IDS,
): Promise<BondPosition[]> {
  const bondPositions = await getBondPositions(
    {},
    {
      url: SUBGRAPH_URL[chainId],
    },
  )
  return bondPositions.bondPositions.map((bondPosition) =>
    toBondPosition(bondPosition),
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
    'id' | 'user' | 'amount' | 'principal' | 'createdAt' | 'updatedAt'
  > & {
    substitute: Pick<Token, 'id' | 'decimals' | 'name' | 'symbol'>
    underlying: Pick<Token, 'id' | 'decimals' | 'name' | 'symbol'>
    fromEpoch: Pick<Epoch, 'id' | 'startTimestamp' | 'endTimestamp'>
    toEpoch: Pick<Epoch, 'id' | 'startTimestamp' | 'endTimestamp'>
  },
): BondPosition {
  return {
    tokenId: BigInt(bondPosition.id),
    user: bondPosition.user as `0x${string}`,
    substitute: toCurrency(bondPosition.substitute),
    underlying: toCurrency(bondPosition.underlying),
    interest: BigInt(bondPosition.amount) - BigInt(bondPosition.principal),
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
