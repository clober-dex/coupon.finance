import {
  getBuiltGraphSDK,
  getIntegratedPositionsQuery,
  getIntegratedQuery,
} from '../.graphclient'
import { SUBGRAPH_URL } from '../constants/subgraph-url'
import { CHAIN_IDS } from '../constants/chain'
import { currentTimestampInSeconds } from '../utils/date'

const { getIntegrated, getIntegratedPositions } = getBuiltGraphSDK()

export async function fetchIntegrated(
  chainId: CHAIN_IDS,
): Promise<getIntegratedQuery> {
  return getIntegrated(
    {
      timestamp: currentTimestampInSeconds().toString(),
    },
    {
      url: SUBGRAPH_URL[chainId],
    },
  )
}

export async function fetchIntegratedPositions(
  chainId: CHAIN_IDS,
  userAddress: `0x${string}`,
): Promise<getIntegratedPositionsQuery> {
  return getIntegratedPositions(
    {
      userAddress: userAddress.toLowerCase(),
    },
    {
      url: SUBGRAPH_URL[chainId],
    },
  )
}
