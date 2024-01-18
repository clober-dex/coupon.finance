import React, { useEffect, useMemo, useState } from 'react'
import { useFeeData, useQuery } from 'wagmi'
import { zeroAddress } from 'viem'
import BigNumber from 'bignumber.js'

import { LoanPosition } from '../../model/loan-position'
import AdjustLeverageModal from '../../components/modal/adjust-leverage-modal'
import { calculateLtv } from '../../utils/ltv'
import { useCurrencyContext } from '../../contexts/currency-context'
import { useChainContext } from '../../contexts/chain-context'
import { abs, applyPercent } from '../../utils/bigint'
import { fetchCallDataByOdos } from '../../apis/odos'
import { CONTRACT_ADDRESSES } from '../../constants/addresses'
import { CHAIN_IDS } from '../../constants/chain'
import { MIN_DEBT_SIZE_IN_ETH } from '../../constants/debt'
import { ethValue } from '../../utils/currency'
import { useBorrowContext } from '../../contexts/borrow-context'
import {
  DEFAULT_LEVERAGE_SIMULATION,
  simulateAdjustingLeverage,
  SLIPPAGE_LIMIT_PERCENT,
} from '../../model/leverage'

const AdjustLeverageModalContainer = ({
  position,
  onClose,
}: {
  position: LoanPosition
  onClose: () => void
}) => {
  const { selectedChain } = useChainContext()
  const { data: feeData } = useFeeData()
  const { prices } = useCurrencyContext()
  const {
    repayWithCollateral: deleverage,
    leverageMore,
    closeLeveragePosition,
    multipleFactors,
  } = useBorrowContext()
  const multipleFactor = multipleFactors[Number(position.id)]
  const previousMultiple =
    (Number(position.collateralAmount) /
      Number(position.collateralAmount - position.borrowedCollateralAmount)) *
    multipleFactor
  const [multiple, setMultiple] = useState(previousMultiple)
  const [multipleBuffer, setMultipleBuffer] = useState({
    previous: multiple,
    updateAt: Date.now(),
  })

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

  const collateralAmountDelta = useMemo(() => {
    return (
      applyPercent(
        position.collateralAmount,
        (multiple / (previousMultiple * multipleFactor)) * 100,
      ) - position.collateralAmount
    )
  }, [multiple, multipleFactor, position.collateralAmount, previousMultiple])

  // ready to calculate
  const {
    data: { debtAmount, collateralAmount, borrowMore, repayWithCollateral },
  } = useQuery(
    [
      'adjust-leverage-position-simulate',
      position,
      multipleBuffer,
      selectedChain,
    ], // TODO: useDebounce
    async () => {
      return feeData && feeData.gasPrice
        ? simulateAdjustingLeverage(
            collateralAmountDelta,
            multiple,
            previousMultiple,
            position,
            prices,
            selectedChain.id as CHAIN_IDS,
            feeData.gasPrice,
          )
        : DEFAULT_LEVERAGE_SIMULATION
    },
    {
      refetchInterval: 10 * 1000,
      refetchIntervalInBackground: true,
      initialData: DEFAULT_LEVERAGE_SIMULATION,
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
