import { Collateral } from '../model/collateral'
import { Currency } from '../model/currency'

import { BigDecimal, dollarValue } from './numbers'

export const LIQUIDATION_TARGET_LTV_PRECISION = 1000000n

export const calculateLtv = (
  loanCurrency: Currency,
  loanAssetPrice: BigDecimal,
  loanAmount: bigint,
  collateral: Collateral,
  collateralPrice: BigDecimal,
  collateralAmount: bigint,
): number => {
  return dollarValue(loanAmount, loanCurrency.decimals, loanAssetPrice)
    .times(100)
    .div(
      dollarValue(
        collateralAmount,
        collateral.underlying.decimals,
        collateralPrice,
      ),
    )
    .toNumber()
}

export const calculateMaxLoanableAmount = (
  loanCurrency: Currency,
  loanAssetPrice: BigDecimal,
  collateral: Collateral,
  collateralPrice: BigDecimal,
  collateralAmount: bigint,
): bigint => {
  return loanAssetPrice && collateralPrice
    ? (collateralAmount *
        collateral.liquidationTargetLtv *
        collateralPrice.value *
        10n ** BigInt(18 - collateral.underlying.decimals)) /
        (collateral.ltvPrecision *
          loanAssetPrice.value *
          10n ** BigInt(18 - loanCurrency.decimals))
    : 0n
}
