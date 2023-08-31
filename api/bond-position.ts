import { BondPosition } from '../model/bond-position'
import { getBuiltGraphSDK } from '../.graphclient'

import { toCurrency } from './asset'

const { getBondPositions } = getBuiltGraphSDK()

export async function fetchBondPositions(
  userAddress: `0x${string}`,
): Promise<BondPosition[]> {
  const { bondPositions } = await getBondPositions({
    userAddress: userAddress.toLowerCase(),
  })
  return bondPositions.map((bondPosition) => ({
    substitute: toCurrency(bondPosition.substitute),
    underlying: toCurrency(bondPosition.underlying),
    interest: BigInt(bondPosition.amount) - BigInt(bondPosition.principal),
    amount: BigInt(bondPosition.amount),
    expiryEpoch: BigInt(bondPosition.toEpoch.id),
    expiryTimestamp: BigInt(bondPosition.toEpoch.endTimestamp),
  }))
}
