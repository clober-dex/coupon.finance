import { Epoch } from '../model/epoch'
import { getBuiltGraphSDK } from '../.graphclient'
import { SUBGRAPH_URL } from '../constants/subgraph-url'
import { CHAIN_IDS } from '../constants/chain'
import { currentTimestampInSeconds } from '../utils/date'

const { getEpochs } = getBuiltGraphSDK()

export async function fetchEpochs(chainId: CHAIN_IDS): Promise<Epoch[]> {
  const { epoches } = await getEpochs(
    {
      timestamp: currentTimestampInSeconds().toString(),
    },
    {
      url: SUBGRAPH_URL[chainId],
    },
  )
  return epoches
    .map((epoch) => ({
      id: +epoch.id,
      startTimestamp: +epoch.startTimestamp,
      endTimestamp: +epoch.endTimestamp,
    }))
    .sort((a, b) => a.endTimestamp - b.endTimestamp)
}
