import { BondPosition } from '../model/bond-position'
import { getBuiltGraphSDK } from '../.graphclient'

import { toCurrency } from './asset'

const { getBondPositions } = getBuiltGraphSDK()

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
  return bondPositions.map((bondPosition) => ({
    tokenId: bondPosition.id,
    substitute: toCurrency(bondPosition.substitute),
    underlying: toCurrency(bondPosition.underlying),
    interest: (
      BigInt(bondPosition.amount) - BigInt(bondPosition.principal)
    ).toString(),
    amount: bondPosition.amount,
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
  }))
}
