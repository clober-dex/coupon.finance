import { formatUnits as _formatUnits } from 'viem'
import BigNumber from 'bignumber.js'

export type BigDecimal = {
  value: bigint
  decimals: number
}

export const dollarValue = (
  value: bigint,
  decimals: number,
  price?: BigDecimal,
): BigNumber => {
  if (!price) {
    return new BigNumber(0)
  }
  return new BigNumber(value.toString())
    .times(price.value.toString())
    .div(10 ** decimals)
    .div(10 ** price.decimals)
}

export const formatDollarValue = (
  value: bigint,
  decimals: number,
  price?: BigDecimal,
): string => {
  return `$${dollarValue(value, decimals, price).toFixed(2)}`
}

export const formatUnits = (
  value: bigint,
  decimals: number,
  price?: BigDecimal,
): string => {
  const formatted = _formatUnits(value, decimals)
  if (!price) {
    return formatted
  }
  const priceValue = Number(price.value) / 10 ** price.decimals
  const underHalfPennyDecimals =
    Math.floor(Math.max(-Math.log10(0.005 / priceValue), 0) / 2) * 2
  const fixed = new BigNumber(formatted).toFixed(underHalfPennyDecimals)
  return +fixed === 0 ? formatted : fixed
}

export const getDecimalPlaces = (
  number: BigNumber.Value,
  places: number = 4,
) => {
  const TEN = new BigNumber(10)
  const value = new BigNumber(number)
  if (value.eq(0)) {
    return places
  }
  if (value.gte(TEN.pow(places))) {
    return 0
  }
  let i = 0
  while (value.abs().lt(TEN.pow(-i * places))) {
    i += 1
  }
  return i ? i * places : 4
}

export const toPlacesString = (number: BigNumber.Value, places: number = 4) => {
  const value = new BigNumber(number)
  return value.toFixed(Number(getDecimalPlaces(number, places)))
}
