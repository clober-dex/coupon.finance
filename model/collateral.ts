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
    liquidationThreshold: BigInt(0),
    liquidationTargetLtv: BigInt(0),
    ltvPrecision: BigInt(0),
    totalCollateralized: BigInt(0),
    totalBorrowed: BigInt(0),
  }
}
