import { getIntegratedPositionsQuery } from '../.graphclient'
import { LiquidationHistory } from '../model/liquidation-history'
import { LIQUIDATION_TARGET_LTV_PRECISION } from '../utils/ltv'

import { toCurrency } from './asset'

export function extractLiquidationHistories(
  integratedPositions: getIntegratedPositionsQuery | undefined,
) {
  if (!integratedPositions) {
    return []
  }
  const { liquidationHistories } = integratedPositions
  return liquidationHistories.map((liquidationHistory) => {
    return {
      tx: liquidationHistory.id,
      positionId: BigInt(liquidationHistory.positionId),
      underlying: toCurrency(liquidationHistory.underlying),
      collateral: {
        underlying: toCurrency(liquidationHistory.collateral.underlying),
        substitute: toCurrency(liquidationHistory.collateral.substitute),
        liquidationThreshold: BigInt(
          liquidationHistory.collateral.liquidationThreshold,
        ),
        liquidationTargetLtv: BigInt(
          liquidationHistory.collateral.liquidationTargetLtv,
        ),
        ltvPrecision: LIQUIDATION_TARGET_LTV_PRECISION,
        totalCollateralized: BigInt(
          liquidationHistory.collateral.totalCollateralized,
        ),
        totalBorrowed: BigInt(liquidationHistory.collateral.totalBorrowed),
      },
      liquidatedCollateralAmount: BigInt(
        liquidationHistory.liquidatedCollateralAmount,
      ),
      repaidDebtAmount: BigInt(liquidationHistory.repaidDebtAmount),
      collateralCurrencyPrice: {
        value: BigInt(
          Math.floor(
            Number(liquidationHistory.collateralCurrencyPrice) * 10 ** 8,
          ),
        ),
        decimals: 8,
      },
      debtCurrencyPrice: {
        value: BigInt(
          Math.floor(Number(liquidationHistory.debtCurrencyPrice) * 10 ** 8),
        ),
        decimals: 8,
      },
      timestamp: BigInt(liquidationHistory.timestamp),
    } as LiquidationHistory
  })
}
