import { formatUnits as _formatUnits, parseUnits as _parseUnits } from 'viem'
import BigNumber from 'bignumber.js'

export type BigDecimal = {
  value: bigint
  decimals: number
}

export const MILLION = '1000000'
export const BILLION = '1000000000'
export const TRILLION = '1000000000000'

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
  return toDollarString(dollarValue(value, decimals, price))
}

export const toHumanFriendly = (value: number): string => {
  let suffix = ''
  let abbreviatedValue = value
  if (value >= 1000000000) {
    abbreviatedValue = value / 1000000000
    suffix = 'B'
  } else if (value >= 1000000) {
    abbreviatedValue = value / 1000000
    suffix = 'M'
  } else if (value >= 1000) {
    abbreviatedValue = value / 1000
    suffix = 'K'
  }
  return `${abbreviatedValue.toFixed(2)}${suffix}`
}

export const toDollarString = (dollarValue: BigNumber): string => {
  let abbreviatedDollarValue = dollarValue
  let suffix = ''
  if (dollarValue.gte(TRILLION)) {
    abbreviatedDollarValue = dollarValue.div(TRILLION)
    suffix = 'T'
  } else if (dollarValue.gte(BILLION)) {
    abbreviatedDollarValue = dollarValue.div(BILLION)
    suffix = 'B'
  } else if (dollarValue.gte(MILLION)) {
    abbreviatedDollarValue = dollarValue.div(MILLION)
    suffix = 'M'
  }
  return `$${toCommaSeparated(abbreviatedDollarValue.toFixed(2))}${suffix}`
}

export const sanitizeNumber = (value: string): string => {
  return value.replace(/[^0-9.-]/g, '')
}

export const parseUnits = (value: string, decimals: number): bigint => {
  return _parseUnits(sanitizeNumber(value), decimals)
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
  const fixed = toCommaSeparated(
    new BigNumber(formatted).toFixed(underHalfPennyDecimals),
  )
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

export const toCommaSeparated = (number: string) => {
  const parts = number.split('.')
  const integer = parts[0]
  const decimal = parts[1]
  const formattedInteger =
    (integer.startsWith('-') ? '-' : '') +
    integer.replace('-', '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decimal ? `${formattedInteger}.${decimal}` : formattedInteger
}
