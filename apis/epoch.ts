import { Epoch } from '../model/epoch'
import { getIntegratedQuery } from '../.graphclient'
import { currentTimestampInSeconds } from '../utils/date'

export function extractEpochs(integrated: getIntegratedQuery | null): Epoch[] {
  if (!integrated) {
    return []
  }
  const now = currentTimestampInSeconds()
  const { epoches } = integrated
  return epoches
    .map((epoch) => ({
      id: +epoch.id,
      startTimestamp: +epoch.startTimestamp,
      endTimestamp: +epoch.endTimestamp,
    }))
    .sort((a, b) => a.endTimestamp - b.endTimestamp)
    .filter((epoch) => epoch.endTimestamp > now)
}
