import { BondPosition } from '../model/bond-position'
import {
  BondPosition as GraphqlBondPosition,
  Epoch,
  getBuiltGraphSDK,
  Token,
} from '../.graphclient'

import { toCurrency } from './asset'

const { getBondPositions, getBondPosition } = getBuiltGraphSDK()

export async function fetchBondPositions(
  userAddress: `0x${string}`,
): Promise<BondPosition[]> {
  const { bondPositions } = await getBondPositions(
    {
      userAddress: userAddress.toLowerCase(),
    },
    {
      url: process.env.SUBGRAPH_URL,
    },
  )
  return bondPositions.map((bondPosition) => toBondPosition(bondPosition))
}

export async function fetchBondPosition(
  positionId: bigint,
): Promise<BondPosition | undefined> {
  const { bondPosition } = await getBondPosition(
    {
      positionId: positionId.toString(),
    },
    {
      url: process.env.SUBGRAPH_URL,
    },
  )
  return bondPosition ? toBondPosition(bondPosition) : undefined
}

function toBondPosition(
  bondPosition: Pick<
    GraphqlBondPosition,
    'id' | 'user' | 'amount' | 'principal' | 'createdAt'
  > & {
    substitute: Pick<Token, 'id' | 'decimals' | 'name' | 'symbol'>
    underlying: Pick<Token, 'id' | 'decimals' | 'name' | 'symbol'>
    fromEpoch: Pick<Epoch, 'id' | 'startTimestamp' | 'endTimestamp'>
    toEpoch: Pick<Epoch, 'id' | 'startTimestamp' | 'endTimestamp'>
  },
): BondPosition {
  return {
    tokenId: BigInt(bondPosition.id),
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
  }
}
