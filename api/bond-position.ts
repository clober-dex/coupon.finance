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
    underlying: toCurrency(bondPosition.underlying),
    interest: bondPosition.amount, // TODO: use real interest
    amount: bondPosition.amount,
    expiryEpoch: bondPosition.expiryEpoch,
    expiryTimestamp: bondPosition.expiryTimestamp,
  }))
}
