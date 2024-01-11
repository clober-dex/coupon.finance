import React, { useEffect, useMemo, useState } from 'react'
import { useFeeData, useQuery } from 'wagmi'
import { isAddressEqual, zeroAddress } from 'viem'
import BigNumber from 'bignumber.js'

import { LoanPosition } from '../../model/loan-position'
import AdjustLeverageModal from '../../components/modal/adjust-leverage-modal'
import { calculateLtv, calculateMaxLoanableAmount } from '../../utils/ltv'
import { useCurrencyContext } from '../../contexts/currency-context'
import { useChainContext } from '../../contexts/chain-context'
import { abs, applyPercent, max } from '../../utils/bigint'
import { fetchAmountOutByOdos, fetchCallDataByOdos } from '../../apis/odos'
import { fetchMarketsByQuoteTokenAddress } from '../../apis/market'
import { CONTRACT_ADDRESSES } from '../../constants/addresses'
import { CHAIN_IDS } from '../../constants/chain'
import {
  calculateCouponsToBorrow,
  calculateCouponsToRepay,
} from '../../model/market'
import { MIN_DEBT_SIZE_IN_ETH } from '../../constants/debt'
import { ethValue } from '../../utils/currency'
import { useBorrowContext } from '../../contexts/borrow-context'

const SLIPPAGE_LIMIT_PERCENT = 0.5
const AdjustLeverageModalContainer = ({
  position,
  onClose,
}: {
  position: LoanPosition
  onClose: () => void
}) => {
  const { selectedChain } = useChainContext()
  const { data: feeData } = useFeeData()
  const { prices, assets } = useCurrencyContext()
  const {
    repayWithCollateral: deleverage,
    leverageMore,
    closeLeveragePosition,
  } = useBorrowContext()
  const previousMultiple = Math.floor(
    Number(position.collateralAmount) /
      Number(position.collateralAmount - position.borrowedCollateralAmount),
  )
  const [multiple, setMultiple] = useState(previousMultiple)
  const [multipleBuffer, setMultipleBuffer] = useState({
    previous: multiple,
    updateAt: Date.now(),
  })

  const asset = useMemo(() => {
    return assets.find((asset) =>
      isAddressEqual(asset.underlying.address, position.underlying.address),
    )
  }, [assets, position.underlying.address])

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        Date.now() - multipleBuffer.updateAt > 100 &&
        multipleBuffer.previous !== multiple
      ) {
        setMultipleBuffer({
          previous: multiple,
          updateAt: Date.now(),
        })
      }
    }, 250)
    return () => clearInterval(interval)
  }, [multiple, multipleBuffer.previous, multipleBuffer.updateAt])

  // ready to calculate
  const {
    data: {
      collateralAmountDelta,
      debtAmount,
      collateralAmount,
      borrowMore,
      repayWithCollateral,
    },
  } = useQuery(
    [
      'adjust-leverage-position-simulate',
      position,
      multipleBuffer,
      selectedChain,
    ], // TODO: useDebounce
    async () => {
      const inputCollateralAmount =
        position.collateralAmount - position.borrowedCollateralAmount
      const collateralAmountDelta =
        applyPercent(inputCollateralAmount, multiple * 100) -
        position.collateralAmount
      if (
        !feeData?.gasPrice ||
        !asset ||
        abs(collateralAmountDelta) <= 100n ||
        multiple === 1
      ) {
        return {
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
      }

      const collateralAmount = position.collateralAmount + collateralAmountDelta
      const maxLoanableAmountExcludingCouponFee =
        prices[asset.underlying.address] &&
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
            chainId: selectedChain.id,
            amountIn: abs(collateralAmountDelta),
            tokenIn: position.collateral.underlying.address,
            tokenOut: asset.underlying.address,
            slippageLimitPercent: SLIPPAGE_LIMIT_PERCENT,
            userAddress:
              CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS]
                .BorrowController,
            gasPrice: Number(feeData.gasPrice),
          }),
          (
            await fetchMarketsByQuoteTokenAddress(
              selectedChain.id,
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
              chainId: selectedChain.id,
              amountIn: amountOut,
              tokenIn: asset.underlying.address,
              tokenOut: position.collateral.underlying.address,
              slippageLimitPercent: SLIPPAGE_LIMIT_PERCENT,
              userAddress:
                CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS]
                  .BorrowController,
              gasPrice: Number(feeData.gasPrice),
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
    },
    {
      refetchInterval: 10 * 1000,
      refetchIntervalInBackground: true,
      initialData: {
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
      },
    },
  )

  const minDebtSizeInEth = MIN_DEBT_SIZE_IN_ETH[selectedChain.id as CHAIN_IDS]
  const expectedDebtSizeInEth = ethValue(
    prices[zeroAddress],
    position.underlying,
    debtAmount,
    prices[position.underlying.address],
    selectedChain.nativeCurrency.decimals,
  )
  const isExpectedDebtSizeLessThanMinDebtSize =
    expectedDebtSizeInEth.lt(minDebtSizeInEth) && expectedDebtSizeInEth.gt(0)

  const isLoadingResults = useMemo(
    () => multiple !== 1 && !borrowMore.pathId && !repayWithCollateral.pathId,
    [borrowMore.pathId, multiple, repayWithCollateral.pathId],
  )

  return (
    <AdjustLeverageModal
      isLoadingResults={isLoadingResults}
      onClose={onClose}
      debtCurrency={position.underlying}
      debtCurrencyPrice={prices[position.underlying.address]}
      collateral={position.collateral}
      collateralPrice={prices[position.collateral.underlying.address]}
      multiple={multiple}
      setMultiple={setMultiple}
      maxAvailableMultiple={Math.max(
        Math.floor(
          1 /
            (1 -
              Number(position.collateral.liquidationTargetLtv) /
                Number(position.collateral.ltvPrecision)),
        ) - 0.02,
        previousMultiple,
      )}
      previousMultiple={previousMultiple}
      currentLtv={
        prices[position.underlying.address] &&
        prices[position.collateral.underlying.address]
          ? calculateLtv(
              position.underlying,
              prices[position.underlying.address],
              position.amount,
              position.collateral,
              prices[position.collateral.underlying.address],
              position.collateralAmount,
            )
          : 0
      }
      expectedLtv={
        prices[position.underlying.address] &&
        prices[position.collateral.underlying.address]
          ? calculateLtv(
              position.underlying,
              prices[position.underlying.address],
              debtAmount,
              position.collateral,
              prices[position.collateral.underlying.address],
              collateralAmount,
            )
          : 0
      }
      currentPositionSize={position.collateralAmount}
      expectedPositionSize={collateralAmount}
      currentRemainingDebt={position.amount}
      expectedRemainingDebt={debtAmount}
      actionButtonProps={{
        onClick: async () => {
          if (isLoadingResults || multiple === previousMultiple) {
            return
          }

          if (multiple === 1) {
            await closeLeveragePosition(position)
          } else if (
            multiple < previousMultiple &&
            repayWithCollateral.pathId
          ) {
            const { data: swapData } = await fetchCallDataByOdos({
              pathId: repayWithCollateral.pathId,
              userAddress:
                CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS]
                  .BorrowController,
            })
            await deleverage(
              position,
              abs(collateralAmountDelta),
              repayWithCollateral.repayAmount,
              repayWithCollateral.refund,
              swapData,
              SLIPPAGE_LIMIT_PERCENT,
            )
          } else if (multiple > previousMultiple && borrowMore.pathId) {
            const { data: swapData } = await fetchCallDataByOdos({
              pathId: borrowMore.pathId,
              userAddress:
                CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS]
                  .BorrowController,
            })
            await leverageMore(
              position,
              abs(collateralAmountDelta),
              borrowMore.debtAmountWithoutCouponFee,
              borrowMore.interest,
              swapData,
              SLIPPAGE_LIMIT_PERCENT,
            )
          }
          onClose()
        },
        disabled:
          multiple === previousMultiple ||
          isLoadingResults ||
          (multiple > previousMultiple &&
            borrowMore.debtAmountWithoutCouponFee >
              borrowMore.availableToBorrow - borrowMore.maxInterest) ||
          (multiple > previousMultiple &&
            borrowMore.debtAmountWithoutCouponFee >
              borrowMore.maxLoanableAmountExcludingCouponFee -
                borrowMore.maxInterest) ||
          isExpectedDebtSizeLessThanMinDebtSize,
        text:
          multiple > previousMultiple &&
          borrowMore.debtAmountWithoutCouponFee >
            borrowMore.availableToBorrow - borrowMore.maxInterest
            ? 'Not enough coupons for sale'
            : multiple > previousMultiple &&
              borrowMore.debtAmountWithoutCouponFee >
                borrowMore.maxLoanableAmountExcludingCouponFee -
                  borrowMore.maxInterest
            ? 'Not enough collateral'
            : isExpectedDebtSizeLessThanMinDebtSize
            ? `Remaining debt must be ≥ ${minDebtSizeInEth.toFixed(
                3,
                BigNumber.ROUND_CEIL,
              )} ETH`
            : multiple === 1
            ? 'Close Position'
            : 'Edit Multiple',
      }}
    />
  )
}

export default AdjustLeverageModalContainer
