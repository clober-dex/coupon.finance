import BigNumber from 'bignumber.js'

import { Collateral } from '../model/collateral'
import { Currency } from '../model/currency'
import { isStableCoin } from '../contexts/currency-context'

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

export const getLTVTextColor = (
  ltv: number,
  collateral: Collateral,
): string => {
  const liquidationThreshold =
    (Number(collateral.liquidationThreshold) * 100) /
    Number(collateral.ltvPrecision)
  const liquidationTargetLtv =
    (Number(collateral.liquidationTargetLtv) * 100) /
    Number(collateral.ltvPrecision)

  if (collateral.liquidationThreshold === 0n) {
    return ''
  }

  if (ltv >= liquidationThreshold - 0.5) {
    return 'text-red-500'
  } else if (liquidationThreshold - 0.5 > ltv && ltv > liquidationTargetLtv) {
    return 'text-yellow-500'
  }
  return 'text-green-500'
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

export const calculateLiquidationPrice = (
  loanCurrency: Currency,
  loanAssetPrice: BigDecimal,
  collateral: Collateral,
  collateralPrice: BigDecimal,
  loanAmount: bigint,
  collateralAmount: bigint,
): number => {
  if (loanAmount === 0n || collateralAmount === 0n) {
    return 0
  }
  const factor = new BigNumber(
    Number(collateral.liquidationThreshold) / Number(collateral.ltvPrecision),
  )
    .times(
      dollarValue(
        collateralAmount,
        collateral.underlying.decimals,
        collateralPrice,
      ),
    )
    .div(dollarValue(loanAmount, loanCurrency.decimals, loanAssetPrice))
  const currentPrice =
    loanAssetPrice && collateralPrice
      ? Number(loanAssetPrice.value) / Number(collateralPrice.value)
      : 0
  const isShortPosition =
    isStableCoin(collateral.underlying) && !isStableCoin(loanCurrency)
  return isStableCoin(collateral.underlying) || isStableCoin(loanCurrency)
    ? isShortPosition
      ? factor.times(currentPrice).toNumber()
      : 1 / factor.times(currentPrice).toNumber()
    : 0
}
