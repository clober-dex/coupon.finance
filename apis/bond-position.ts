import { BondPosition } from '../model/bond-position'
import {
  BondPosition as GraphqlBondPosition,
  Epoch,
  getBuiltGraphSDK,
  Token,
} from '../.graphclient'
import { SUBGRAPH_URL } from '../constants/subgraph-url'
import { CHAIN_IDS } from '../constants/chain'
import { currentTimestampInSeconds } from '../utils/date'

import { toCurrency } from './asset'

const { getBondPositions, getBondPosition } = getBuiltGraphSDK()

export async function fetchBondPositions(
  chainId: CHAIN_IDS,
  userAddress: `0x${string}`,
  pendingBondPositions?: BondPosition[],
): Promise<BondPosition[]> {
  const { bondPositions } = await getBondPositions(
    {
      userAddress: userAddress.toLowerCase(),
    },
    {
      url: SUBGRAPH_URL[chainId],
    },
  )
  const positions = bondPositions.map((bondPosition) =>
    toBondPosition(bondPosition),
  )
  const now = currentTimestampInSeconds()
  return positions.concat(
    (pendingBondPositions ?? []).filter(
      (pendingBondPosition) => now - pendingBondPosition.createdAt < 10,
    ),
  )
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
    isPending: false,
  }
}
