export const YEAR_IN_SECONDS = 31536000
export const getEpoch = (timestamp: number): bigint => {
  const date = new Date(timestamp * 1000)
  const year = date.getUTCFullYear()
  const half = new Date(`${year}-07-01`).getTime()
  return BigInt((year - 1970) * 2 + (date.getTime() < half ? 0 : 1))
}
