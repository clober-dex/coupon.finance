import { NumberValue } from 'd3-scale'

import {
  TIME_PERIOD_TO_FORMAT_OPTIONS,
  TimePeriod,
  TimestampFormatterType,
} from '../model/chart'

export const SECONDS_IN_DAY = 60 * 60 * 24
export const SECONDS_IN_MONTH = 60 * 60 * 24 * 30

export const formatDate = (date: Date): string =>
  Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
    .format(date.setDate(date.getDate() - 1))
    .replace(',', '')

export const getExpirationDateTextColor = (
  expirationDate: number,
  now: number,
): string => {
  const daysLeft = getDaysBetweenDates(
    new Date(now * 1000),
    new Date(expirationDate * 1000),
  )
  if (daysLeft <= 3) {
    return 'text-red-500'
  }
  return ''
}

export const currentTimestampInSeconds = (): number =>
  Math.floor(new Date().getTime() / 1000)

export const getDeadlineTimestampInSeconds = (): bigint => {
  return BigInt(Math.floor(currentTimestampInSeconds() + 60 * 20))
}

export const getNextMonthStartTimestamp = (now: number): number => {
  const nextMonth = new Date(now * 1000)
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  nextMonth.setDate(1)
  nextMonth.setHours(0, 0, 0, 0)
  return nextMonth.getTime() / 1000
}

export const getDaysBetweenDates = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.ceil(diffTime / (1000 * SECONDS_IN_DAY))
}

/**
 * Returns a function to format timestamps, specialized by timePeriod and type to display ('tick' or 'crosshair'),
 * localized for the given locale.
 */
export function getTimestampFormatter(
  timePeriod: TimePeriod,
  locale: string,
  formatterType: TimestampFormatterType,
): (n: NumberValue) => string {
  // Choose appropriate formatting options based on type and timePeriod
  const options = TIME_PERIOD_TO_FORMAT_OPTIONS[timePeriod][formatterType]
  const dateTimeFormatter = new Intl.DateTimeFormat(locale, options)

  return (timestamp: NumberValue): string => {
    const epochTimeInMilliseconds = timestamp.valueOf() * 1000
    return dateTimeFormatter.format(epochTimeInMilliseconds)
  }
}
