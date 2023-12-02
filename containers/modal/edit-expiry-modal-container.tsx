import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'wagmi'
import { zeroAddress } from 'viem'
import BigNumber from 'bignumber.js'

import { LoanPosition } from '../../model/loan-position'
import {
  fetchInterestOrRefundCouponAmountByEpochs,
  fetchMarketsByQuoteTokenAddress,
} from '../../apis/market'
import { useBorrowContext } from '../../contexts/borrow-context'
import { useCurrencyContext } from '../../contexts/currency-context'
import EditExpiryModal from '../../components/modal/edit-expiry-modal'
import { useChainContext } from '../../contexts/chain-context'
import { max, min } from '../../utils/bigint'
import { calculateMaxLoanableAmount } from '../../utils/ltv'
import {
  calculateCouponsToBorrow,
  calculateCouponsToRepay,
} from '../../model/market'
import { MIN_DEBT_SIZE_IN_ETH } from '../../constants/debt'
import { CHAIN_IDS } from '../../constants/chain'
import { ethValue } from '../../utils/currency'

const EditExpiryModalContainer = ({
  position,
  onClose,
}: {
  position: LoanPosition
  onClose: () => void
}) => {
  const { selectedChain } = useChainContext()
  const { prices } = useCurrencyContext()
  const { extendLoanDuration, shortenLoanDuration } = useBorrowContext()

  const [epochs, setEpochs] = useState(0)

  const { data } = useQuery(
    ['edit-expiry-simulate', position, selectedChain],
    () =>
      fetchInterestOrRefundCouponAmountByEpochs(
        selectedChain.id,
        position.substitute,
        position.amount,
        position.toEpoch.id,
      ),
  )

  const maxLoanableAmountExcludingCouponFee = useMemo(
    () =>
      prices[position.underlying.address] &&
      prices[position.collateral.underlying.address]
        ? max(
            calculateMaxLoanableAmount(
              position.underlying,
              prices[position.underlying.address],
              position.collateral,
              prices[position.collateral.underlying.address],
              position.collateralAmount,
            ) - position.amount,
            0n,
          )
        : 0n,
    [
      position.amount,
      position.collateral,
      position.collateralAmount,
      position.underlying,
      prices,
    ],
  )

  const [expiryEpochIndex, borrowAmount, payable, repayAmount] = useMemo(() => {
    if (!data) {
      return [0, 0n, false, 0n, false]
    }
    const expiryEpochIndex = data.findIndex((item) => item.expiryEpoch)
    return [
      expiryEpochIndex,
      data
        .slice(expiryEpochIndex + 1, epochs + 1)
        .reduce((acc, { interest }) => acc + interest, 0n),
      data
        .slice(expiryEpochIndex + 1, epochs + 1)
        .reduce((acc, { payable }) => acc && payable, true),
      data
        .slice(epochs + 1, expiryEpochIndex + 1)
        .reduce((acc, { refund }) => acc + refund, 0n),
    ]
  }, [data, epochs])

  useEffect(() => {
    setEpochs(expiryEpochIndex)
  }, [expiryEpochIndex, position, setEpochs])

  const { data: adjustPositionSimulateData } = useQuery(
    [
      'edit-expiry-adjust-position-simulate',
      selectedChain,
      prices,
      position,
      epochs,
      data,
    ],
    async () => {
      const newToEpoch = position.toEpoch.id + epochs - expiryEpochIndex
      const marketsBeforeEditExpiry = (
        await fetchMarketsByQuoteTokenAddress(
          selectedChain.id,
          position.substitute.address,
        )
      ).filter(
        (market) => market.epoch <= Math.max(newToEpoch, position.toEpoch.id),
      )

      // extend or shorten loan duration
      if (position.toEpoch.id < newToEpoch && payable) {
        // extend
        for (let i = 0; i < marketsBeforeEditExpiry.length; i++) {
          if (position.toEpoch.id < marketsBeforeEditExpiry[i].epoch) {
            ;({ market: marketsBeforeEditExpiry[i] } = marketsBeforeEditExpiry[
              i
            ].take(
              marketsBeforeEditExpiry[i].quoteToken.address,
              position.amount,
            ))
          }
        }
        const marketsAfterEditExpiry = marketsBeforeEditExpiry.slice()
        const calculateCouponsToBorrowResult = calculateCouponsToBorrow(
          position.substitute,
          marketsAfterEditExpiry,
          maxLoanableAmountExcludingCouponFee,
          borrowAmount,
        )
        return {
          positionAmountDelta:
            borrowAmount + calculateCouponsToBorrowResult.interest,
          enoughCoupon:
            borrowAmount <= calculateCouponsToBorrowResult.available,
          enoughCollateral:
            borrowAmount <=
            maxLoanableAmountExcludingCouponFee -
              calculateCouponsToBorrowResult.maxInterest,
        }
      } else if (newToEpoch < position.toEpoch.id) {
        // shorten
        let newToEpochIndex = 0
        for (let i = 0; i < marketsBeforeEditExpiry.length; i++) {
          if (newToEpoch === marketsBeforeEditExpiry[i].epoch) {
            newToEpochIndex = i
            break
          }
        }
        const marketsAfterEditExpiry = marketsBeforeEditExpiry.slice(
          0,
          newToEpochIndex + 1,
        )
        const calculateCouponsToRepayResult = calculateCouponsToRepay(
          position.substitute,
          marketsAfterEditExpiry,
          position.amount,
          repayAmount,
        )
        const repayAll =
          repayAmount + calculateCouponsToRepayResult.maxRefund >=
          position.amount
        return {
          positionAmountDelta: -min(
            repayAmount +
              (repayAll
                ? calculateCouponsToRepayResult.maxRefund
                : calculateCouponsToRepayResult.refund),
            position.amount,
          ),
          enoughCoupon: true,
          enoughCollateral: true,
        }
      } else {
        return {
          positionAmountDelta: 0n,
          enoughCoupon: payable,
          enoughCollateral: true,
        }
      }
    },
  )

  const positionAmountDelta =
    adjustPositionSimulateData?.positionAmountDelta ?? 0n
  const enoughCoupon = adjustPositionSimulateData?.enoughCoupon ?? false
  const enoughCollateral = adjustPositionSimulateData?.enoughCollateral ?? false

  const minDebtSizeInEth = MIN_DEBT_SIZE_IN_ETH[selectedChain.id as CHAIN_IDS]
  const expectedDebtSizeInEth = ethValue(
    prices[zeroAddress],
    position.underlying,
    max(position.amount + positionAmountDelta, 0n),
    prices[position.underlying.address],
    selectedChain.nativeCurrency.decimals,
  )
  const isExpectedDebtSizeLessThanMinDebtSize =
    expectedDebtSizeInEth.lt(minDebtSizeInEth) && expectedDebtSizeInEth.gt(0)

  return (
    <EditExpiryModal
      onClose={onClose}
      epochs={epochs}
      setEpochs={setEpochs}
      dateList={data ? data.map(({ date }) => date) : []}
      currency={position.underlying}
      price={prices[position.underlying.address] ?? 0n}
      positionAmountDelta={enoughCoupon ? positionAmountDelta : 0n}
      actionButtonProps={{
        disabled:
          expiryEpochIndex === epochs ||
          (epochs > expiryEpochIndex && !enoughCoupon) ||
          (epochs < expiryEpochIndex && !enoughCoupon) ||
          !enoughCollateral ||
          isExpectedDebtSizeLessThanMinDebtSize,
        onClick: async () => {
          if (epochs > expiryEpochIndex) {
            await extendLoanDuration(
              position,
              epochs - expiryEpochIndex,
              positionAmountDelta,
            )
          } else if (epochs < expiryEpochIndex) {
            await shortenLoanDuration(
              position,
              expiryEpochIndex - epochs,
              -positionAmountDelta,
            )
          }
          setEpochs(0)
          onClose()
        },
        text:
          expiryEpochIndex === epochs
            ? 'Select new expiry date'
            : epochs > expiryEpochIndex && !enoughCoupon
            ? 'Not enough coupons for pay'
            : epochs < expiryEpochIndex && !enoughCoupon
            ? 'Not enough coupons for refund'
            : !enoughCollateral
            ? 'Not enough collateral'
            : isExpectedDebtSizeLessThanMinDebtSize
            ? `Remaining debt must be ≥ ${minDebtSizeInEth.toFixed(
                3,
                BigNumber.ROUND_CEIL,
              )} ETH`
            : 'Edit expiry date',
      }}
    />
  )
}

export default EditExpiryModalContainer
