import { Collateral } from '../model/collateral'
import { Currency } from '../model/currency'

import { BigDecimal, dollarValue } from './numbers'

export const LIQUIDATION_TARGET_LTV_PRECISION = 1000000n

// TODO: unit test
export const calculateLtv = (
  debtCurrency: Currency,
  debtCurrencyPrice: BigDecimal,
  debtAmount: bigint,
  collateral: Collateral,
  collateralPrice: BigDecimal,
  collateralAmount: bigint,
): number => {
  return debtAmount > 0n && collateralAmount <= 0n
    ? Infinity
    : collateralAmount === 0n
    ? 0
    : Math.max(
        dollarValue(debtAmount, debtCurrency.decimals, debtCurrencyPrice)
          .times(100)
          .div(
            dollarValue(
              collateralAmount,
              collateral.underlying.decimals,
              collateralPrice,
            ),
          )
          .toNumber(),
        0,
      )
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

export const calculateMinCollateralAmount = (
  loanCurrency: Currency,
  loanAssetPrice: BigDecimal,
  collateral: Collateral,
  collateralPrice: BigDecimal,
  loanAmount: bigint,
): bigint => {
  return loanAssetPrice && collateralPrice
    ? (loanAmount *
        collateral.ltvPrecision *
        loanAssetPrice.value *
        10n ** BigInt(18 - loanCurrency.decimals)) /
        (collateral.liquidationTargetLtv *
          collateralPrice.value *
          10n ** BigInt(18 - collateral.underlying.decimals))
    : 0n
}
