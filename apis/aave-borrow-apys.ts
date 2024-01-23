import { getAddress } from 'viem'

import { getBuiltGraphSDK } from '../.graphclient'
import { convertVariableBorrowRateToAPY } from '../utils/aave'

const { getAaveBorrowRates } = getBuiltGraphSDK()

export async function fetchAaveBorrowApys() {
  const { reserves } = await getAaveBorrowRates({}, {})
  return reserves.map((reserve) => ({
    name: reserve.name,
    address: getAddress(reserve.underlyingAsset),
    apy: convertVariableBorrowRateToAPY(reserve.variableBorrowRate),
    depositApy: convertVariableBorrowRateToAPY(reserve.liquidityRate),
  }))
}
