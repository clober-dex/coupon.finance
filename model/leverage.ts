import { isAddressEqual } from 'viem'

import { abs, applyPercent, max } from '../utils/bigint'
import { calculateMaxLoanableAmount } from '../utils/ltv'
import { fetchAmountOutByOdos } from '../apis/odos'
import { CONTRACT_ADDRESSES } from '../constants/addresses'
import { CHAIN_IDS } from '../constants/chain'
import { fetchMarketsByQuoteTokenAddress } from '../apis/market'

import { calculateCouponsToBorrow, calculateCouponsToRepay } from './market'
import { LoanPosition } from './loan-position'
import { Asset } from './asset'
import { Prices } from './prices'

export const SLIPPAGE_LIMIT_PERCENT = 0.5

export type LeverageSimulation = {
  debtAmount: bigint
  collateralAmount: bigint
  collateralAmountDelta: bigint
  borrowMore: {
    pathId: undefined | string
    interest: bigint
    maxInterest: bigint
    availableToBorrow: bigint
    debtAmountWithoutCouponFee: bigint
    maxLoanableAmountExcludingCouponFee: bigint
  }
  repayWithCollateral: {
    pathId: undefined | string
    refund: bigint
    maxRefund: bigint
    repayAmount: bigint
  }
}

export const DEFAULT_LEVERAGE_SIMULATION: LeverageSimulation = {
  debtAmount: 0n,
  collateralAmount: 0n,
  collateralAmountDelta: 0n,
  borrowMore: {
    pathId: undefined,
    interest: 0n,
    maxInterest: 0n,
    availableToBorrow: 0n,
    debtAmountWithoutCouponFee: 0n,
    maxLoanableAmountExcludingCouponFee: 0n,
  },
  repayWithCollateral: {
    pathId: undefined,
    refund: 0n,
    maxRefund: 0n,
    repayAmount: 0n,
  },
}

export const simulateLeverageAdjusting = async (
  multiple: number,
  previousMultiple: number,
  position: LoanPosition,
  prices: Prices,
  chainId: CHAIN_IDS,
  gasPrice: bigint,
): Promise<LeverageSimulation> => {
  const inputCollateralAmount =
    position.collateralAmount - position.borrowedCollateralAmount
  const collateralAmountDelta =
    applyPercent(inputCollateralAmount, multiple * 100) -
    position.collateralAmount
  if (abs(collateralAmountDelta) <= 100n || multiple === 1) {
    return DEFAULT_LEVERAGE_SIMULATION
  }

  const collateralAmount = position.collateralAmount + collateralAmountDelta
  const maxLoanableAmountExcludingCouponFee =
    prices[position.underlying.address] &&
    prices[position.collateral.underlying.address]
      ? max(
          calculateMaxLoanableAmount(
            position.underlying,
            prices[position.underlying.address],
            position.collateral,
            prices[position.collateral.underlying.address],
            collateralAmount,
          ) - position.amount,
          0n,
        )
      : 0n

  const [{ amountOut, pathId: repayWithCollateralPathId }, markets] =
    await Promise.all([
      fetchAmountOutByOdos({
        chainId,
        amountIn: abs(collateralAmountDelta),
        tokenIn: position.collateral.underlying.address,
        tokenOut: position.underlying.address,
        slippageLimitPercent: SLIPPAGE_LIMIT_PERCENT,
        userAddress: CONTRACT_ADDRESSES[chainId as CHAIN_IDS].BorrowController,
        gasPrice: Number(gasPrice),
      }),
      (
        await fetchMarketsByQuoteTokenAddress(
          chainId,
          position.substitute.address,
        )
      ).filter((market) => market.epoch <= position.toEpoch.id),
    ])

  const [
    { interest, maxInterest, available: availableToBorrow },
    { refund, maxRefund },
    { pathId: borrowMorePathId },
  ] = await Promise.all([
    calculateCouponsToBorrow(
      position.substitute,
      markets,
      maxLoanableAmountExcludingCouponFee,
      amountOut,
    ),
    calculateCouponsToRepay(
      position.substitute,
      markets,
      position.amount,
      amountOut,
    ),
    multiple > previousMultiple
      ? fetchAmountOutByOdos({
          chainId,
          amountIn: amountOut,
          tokenIn: position.underlying.address,
          tokenOut: position.collateral.underlying.address,
          slippageLimitPercent: SLIPPAGE_LIMIT_PERCENT,
          userAddress:
            CONTRACT_ADDRESSES[chainId as CHAIN_IDS].BorrowController,
          gasPrice: Number(gasPrice),
        })
      : Promise.resolve({ pathId: undefined }),
  ])
  return {
    debtAmount:
      position.amount +
      (multiple === previousMultiple
        ? 0n
        : multiple > previousMultiple
        ? amountOut + interest
        : -(amountOut + refund)),
    collateralAmount,
    collateralAmountDelta,
    borrowMore: {
      pathId: borrowMorePathId,
      interest,
      maxInterest,
      availableToBorrow,
      debtAmountWithoutCouponFee: amountOut,
      maxLoanableAmountExcludingCouponFee,
    },
    repayWithCollateral: {
      pathId: repayWithCollateralPathId,
      refund,
      maxRefund,
      repayAmount: amountOut,
    },
  }
}
