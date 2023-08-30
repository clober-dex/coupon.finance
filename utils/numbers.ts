import { formatUnits as _formatUnits } from 'viem'
import BigNumber from 'bignumber.js'

export const formatDollarValue = (
  value: bigint,
  decimals: number,
  price: number,
): string => {
  return `$${((Number(value) * price) / 10 ** decimals).toFixed(2)}`
}

export const formatUnits = (
  value: bigint,
  decimals: number,
  price?: number,
): string => {
  const formatted = _formatUnits(value, decimals)
  if (!price) {
    return formatted
  }
  const underHalfPennyDecimals =
    Math.floor(Math.max(-Math.log10(0.005 / price), 0) / 2) * 2
  const fixed = new BigNumber(formatted).toFixed(underHalfPennyDecimals)
  return +fixed === 0 ? formatted : fixed
}
