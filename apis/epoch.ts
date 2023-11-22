import { Epoch } from '../model/epoch'
import { getIntegratedQuery } from '../.graphclient'

export function extractEpochs(integrated: getIntegratedQuery | null): Epoch[] {
  if (!integrated) {
    return []
  }
  const { epoches } = integrated
  return epoches
    .map((epoch) => ({
      id: +epoch.id,
      startTimestamp: +epoch.startTimestamp,
      endTimestamp: +epoch.endTimestamp,
    }))
    .sort((a, b) => a.endTimestamp - b.endTimestamp)
}
