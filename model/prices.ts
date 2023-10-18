import { BigDecimal } from '../utils/numbers'

export type Prices = { [key in `0x${string}`]: BigDecimal }
