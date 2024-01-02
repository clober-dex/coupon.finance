import { ScaleLinear } from 'd3-scale'
import { DefaultOutput } from '@visx/scale'

export type PricePoint = { timestamp: number; value: number }
export enum TimePeriod {
  HOUR,
  DAY,
  WEEK,
  MONTH,
  YEAR,
}
export enum ChartErrorType {
  NO_DATA_AVAILABLE,
  NO_RECENT_VOLUME,
  INVALID_CHART,
}

export type ChartDimensions = {
  width: number
  height: number
  marginTop: number
  marginBottom: number
}

export type ErroredChartModel = {
  error: ChartErrorType
  dimensions: ChartDimensions
}

export type ChartModel = {
  prices: PricePoint[]
  startingPrice: PricePoint
  endingPrice: PricePoint
  lastValidPrice: PricePoint
  blanks: PricePoint[][]
  timeScale: ScaleLinear<number, number>
  priceScale: ScaleLinear<number, number>
  dimensions: ChartDimensions
  error: undefined
}

const HOUR_OPTIONS = {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
} as const // e.g. '12:00 PM'
const DAY_HOUR_OPTIONS = {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
} as const // e.g. 'Jul 4, 12:00 PM'
const MONTH_DAY_OPTIONS = { month: 'long', day: 'numeric' } as const // e.g. 'July 4'
const MONTH_YEAR_DAY_OPTIONS = {
  month: 'short',
  year: 'numeric',
  day: 'numeric',
} as const // e.g. 'Jul 4, 2021'
const MONTH_OPTIONS = { month: 'long' } as const // e.g. 'July'
const WEEK_OPTIONS = { weekday: 'long' } as const // e.g. 'Sunday'

// Timestamps are formatted differently based on their location/usage in charts
export enum TimestampFormatterType {
  TICK = 'tick',
  CROSSHAIR = 'crosshair',
}

export const TIME_PERIOD_TO_FORMAT_OPTIONS: Record<
  TimePeriod,
  Record<TimestampFormatterType, Intl.DateTimeFormatOptions>
> = {
  [TimePeriod.HOUR]: {
    [TimestampFormatterType.TICK]: HOUR_OPTIONS,
    [TimestampFormatterType.CROSSHAIR]: DAY_HOUR_OPTIONS,
  },
  [TimePeriod.DAY]: {
    [TimestampFormatterType.TICK]: HOUR_OPTIONS,
    [TimestampFormatterType.CROSSHAIR]: DAY_HOUR_OPTIONS,
  },
  [TimePeriod.WEEK]: {
    [TimestampFormatterType.TICK]: WEEK_OPTIONS,
    [TimestampFormatterType.CROSSHAIR]: DAY_HOUR_OPTIONS,
  },
  [TimePeriod.MONTH]: {
    [TimestampFormatterType.TICK]: MONTH_DAY_OPTIONS,
    [TimestampFormatterType.CROSSHAIR]: DAY_HOUR_OPTIONS,
  },
  [TimePeriod.YEAR]: {
    [TimestampFormatterType.TICK]: MONTH_OPTIONS,
    [TimestampFormatterType.CROSSHAIR]: MONTH_YEAR_DAY_OPTIONS,
  },
}
