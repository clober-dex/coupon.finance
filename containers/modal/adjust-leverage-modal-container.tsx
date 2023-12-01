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
import { fetchAmountOutByOdos } from '../../apis/odos'
import { fetchMarketsByQuoteTokenAddress } from '../../apis/market'
import { CONTRACT_ADDRESSES } from '../../constants/addresses'
import { CHAIN_IDS } from '../../constants/chain'
import {
  calculateCouponsToBorrow,
  calculateCouponsToRepay,
} from '../../model/market'
import { MIN_DEBT_SIZE_IN_ETH } from '../../constants/debt'
import { ethValue } from '../../utils/currency'

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
  const currentMultiple =
    Number(position.collateralAmount) /
    Number(position.collateralAmount - position.borrowedCollateralAmount)
  const [multiple, setMultiple] = useState(currentMultiple)
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
    data: { debtAmount, collateralAmount, borrowMore, repayWithCollateral },
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
      if (!feeData?.gasPrice || !asset || abs(collateralAmountDelta) <= 100n) {
        return {
          debtAmount: 0n,
          collateralAmount: 0n,
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
            amountIn: abs(collateralAmountDelta).toString(),
            tokenIn: position.collateral.underlying.address,
            tokenOut: asset.underlying.address,
            slippageLimitPercent: SLIPPAGE_LIMIT_PERCENT,
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
        collateralAmountDelta > 0n
          ? fetchAmountOutByOdos({
              chainId: selectedChain.id,
              amountIn: amountOut.toString(),
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
          (collateralAmountDelta === 0n
            ? 0n
            : collateralAmountDelta > 0n
            ? amountOut + interest
            : -(amountOut + refund)),
        collateralAmount,
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

  return (
    <AdjustLeverageModal
      isLoadingResults={!borrowMore.pathId && !repayWithCollateral.pathId}
      onClose={onClose}
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
        currentMultiple,
      )}
      currentMultiple={currentMultiple}
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
      actionButtonProps={{
        onClick: () => {
          console.log('TODO: adjust leverage')
        },
        disabled:
          multiple === currentMultiple ||
          (!borrowMore.pathId && !repayWithCollateral.pathId) ||
          (multiple > currentMultiple &&
            borrowMore.debtAmountWithoutCouponFee >
              borrowMore.availableToBorrow - borrowMore.maxInterest) ||
          (multiple > currentMultiple &&
            borrowMore.debtAmountWithoutCouponFee >
              borrowMore.maxLoanableAmountExcludingCouponFee -
                borrowMore.maxInterest) ||
          isExpectedDebtSizeLessThanMinDebtSize,
        text:
          multiple > currentMultiple &&
          borrowMore.debtAmountWithoutCouponFee >
            borrowMore.availableToBorrow - borrowMore.maxInterest
            ? 'Not enough coupons for sale'
            : multiple > currentMultiple &&
              borrowMore.debtAmountWithoutCouponFee >
                borrowMore.maxLoanableAmountExcludingCouponFee -
                  borrowMore.maxInterest
            ? 'Not enough collateral'
            : isExpectedDebtSizeLessThanMinDebtSize
            ? `Remaining debt must be ≥ ${minDebtSizeInEth.toFixed(
                3,
                BigNumber.ROUND_CEIL,
              )} ETH`
            : 'Edit Multiple',
      }}
    />
  )
}

export default AdjustLeverageModalContainer
