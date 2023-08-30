import { Epoch } from '../model/epoch'
import { getBuiltGraphSDK } from '../.graphclient'

const { getEpochs } = getBuiltGraphSDK()

export async function fetchEpochs(): Promise<Epoch[]> {
  const { epoches } = await getEpochs({
    timestamp: Math.floor(new Date().getTime() / 1000).toString(),
  })
  return epoches.map((epoch) => ({
    id: BigInt(epoch.id),
    startTimestamp: BigInt(epoch.startTimestamp),
    endTimestamp: BigInt(epoch.endTimestamp),
  }))
}
