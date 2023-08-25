export const formatDollarValue = (
  value: bigint,
  decimals: number,
  price: number,
): string => {
  return `$${((Number(value) * price) / 10 ** decimals).toFixed(2)}`
}
