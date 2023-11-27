import { Currency } from './currency'

export type Collateral = {
  underlying: Currency
  substitute: Currency
  liquidationThreshold: bigint
  liquidationTargetLtv: bigint
  ltvPrecision: bigint
  totalCollateralized: bigint
  totalBorrowed: bigint
}

export const generateDummyCollateral = (currency: Currency): Collateral => {
  return {
    underlying: currency,
    substitute: currency,
    liquidationThreshold: 0n,
    liquidationTargetLtv: 0n,
    ltvPrecision: 1000000n,
    totalCollateralized: 0n,
    totalBorrowed: 0n,
  }
}
