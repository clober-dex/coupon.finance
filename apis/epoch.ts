import { Epoch } from '../model/epoch'
import { getBuiltGraphSDK } from '../.graphclient'

const { getEpochs } = getBuiltGraphSDK()

export async function fetchEpochs(): Promise<Epoch[]> {
  const { epoches } = await getEpochs(
    {
      timestamp: Math.floor(new Date().getTime() / 1000).toString(),
    },
    {
      url: process.env.SUBGRAPH_URL,
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
