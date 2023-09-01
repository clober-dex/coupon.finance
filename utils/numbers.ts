import { formatUnits as _formatUnits } from 'viem'
import BigNumber from 'bignumber.js'

export const dollarValue = (
  value: bigint,
  decimals: number,
  price: number,
): BigNumber => {
  return BigNumber(value.toString())
    .times(price)
    .div(10 ** decimals)
}

export const formatDollarValue = (
  value: bigint,
  decimals: number,
  price: number,
): string => {
  return `$${dollarValue(value, decimals, price).toFixed(2)}`
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
