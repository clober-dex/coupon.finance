export const MAX_EPOCH = 4
export const YEAR_IN_SECONDS = 31536000
export const getCurrentEpochIndex = (timestamp: number): bigint => {
  const date = new Date(timestamp * 1000)
  const year = date.getUTCFullYear()
  const half = new Date(`${year}-07-01`).getTime()
  return BigInt((year - 1970) * 2 + (date.getTime() < half ? 0 : 1))
}

export const getEpochStartTimestamp = (epochIndex: bigint): number => {
  const year = Number((epochIndex - 1n) >> 1n) + 1970
  const half = epochIndex % 2n ? '01-01' : '07-01'
  return new Date(`${year}-${half}`).getTime() / 1000
}

export const getEpochEndTimestamp = (epochIndex: bigint): number => {
  return getEpochStartTimestamp(epochIndex + 1n) - 1
}
