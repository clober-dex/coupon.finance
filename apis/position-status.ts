import { getBuiltGraphSDK } from '../.graphclient'
import { CHAIN_IDS } from '../constants/chain'
import { SUBGRAPH_URL } from '../constants/subgraph-url'

const { getPositionStatus } = getBuiltGraphSDK()

export async function fetchPositionStatus(chainId: CHAIN_IDS): Promise<{
  totalBondPositionCount: number
  totalLoanPositionCount: number
}> {
  const { positionStatus } = await getPositionStatus(
    {
      chainId: chainId.toString(),
    },
    {
      url: SUBGRAPH_URL[chainId],
    },
  )
  return {
    totalBondPositionCount: Number(positionStatus?.totalBondPositionCount || 0),
    totalLoanPositionCount: Number(positionStatus?.totalLoanPositionCount || 0),
  }
}
