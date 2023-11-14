export const getEpoch = (timestamp: number): bigint => {
  const date = new Date(timestamp * 1000)
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth()
  return BigInt((year - 1970) * 12 + month)
}
