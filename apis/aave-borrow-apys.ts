import { getAddress } from 'viem'

import { getBuiltGraphSDK } from '../.graphclient'
import { convertRateToAPY } from '../utils/aave'

const { getAaveBorrowRates } = getBuiltGraphSDK()

export async function fetchAaveApys() {
  const { reserves } = await getAaveBorrowRates({}, {})
  return reserves.map((reserve) => ({
    name: reserve.name,
    address: getAddress(reserve.underlyingAsset),
    borrowApy: convertRateToAPY(reserve.variableBorrowRate),
    depositApy: convertRateToAPY(reserve.liquidityRate),
  }))
}
