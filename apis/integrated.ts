import {
  getBuiltGraphSDK,
  getIntegratedPointQuery,
  getIntegratedPositionsQuery,
  getIntegratedQuery,
} from '../.graphclient'
import { POINT_SUBGRAPH_URL, SUBGRAPH_URL } from '../constants/subgraph-url'
import { CHAIN_IDS } from '../constants/chain'
import { currentTimestampInSeconds } from '../utils/date'

const { getIntegrated, getIntegratedPositions, getIntegratedPoint } =
  getBuiltGraphSDK()

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

export async function fetchIntegratedPoint(
  chainId: CHAIN_IDS,
  userAddress: `0x${string}`,
): Promise<getIntegratedPointQuery> {
  return getIntegratedPoint(
    {
      userAddress: userAddress.toLowerCase(),
      user: userAddress.toLowerCase(),
    },
    {
      url: POINT_SUBGRAPH_URL[chainId],
    },
  )
}
