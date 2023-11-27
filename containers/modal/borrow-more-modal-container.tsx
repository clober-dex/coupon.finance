import React, { useMemo, useState } from 'react'
import { useQuery } from 'wagmi'

import { LoanPosition } from '../../model/loan-position'
import { useCurrencyContext } from '../../contexts/currency-context'
import { fetchMarketsByQuoteTokenAddress } from '../../apis/market'
import { calculateCouponsToBorrow } from '../../model/market'
import { max, min } from '../../utils/bigint'
import { useBorrowContext } from '../../contexts/borrow-context'
import BorrowMoreModal from '../../components/modal/borrow-more-modal'
import { calculateLtv, calculateMaxLoanableAmount } from '../../utils/ltv'
import { useChainContext } from '../../contexts/chain-context'
import { parseUnits } from '../../utils/numbers'

const BorrowMoreModalContainer = ({
  position,
  onClose,
}: {
  position: LoanPosition
  onClose: () => void
}) => {
  const { selectedChain } = useChainContext()
  const { borrowMore } = useBorrowContext()
  const { prices } = useCurrencyContext()
  const [value, setValue] = useState('')

  const amount = useMemo(
    () => (position ? parseUnits(value, position.underlying.decimals) : 0n),
    [position, value],
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

  const { data } = useQuery(
    [
      'borrow-more-simulate',
      position.underlying.address,
      amount,
      selectedChain,
    ],
    async () => {
      const markets = (
        await fetchMarketsByQuoteTokenAddress(
          selectedChain.id,
          position.substitute.address,
        )
      ).filter((market) => market.epoch <= position.toEpoch.id)
      return calculateCouponsToBorrow(
        position.substitute,
        markets,
        maxLoanableAmountExcludingCouponFee,
        amount,
      )
    },
    {
      keepPreviousData: true,
    },
  )

  const [available, interest, maxInterest] = useMemo(() => {
    return [
      data?.available ?? 0n,
      data?.interest ?? 0n,
      data?.maxInterest ?? 0n,
    ]
  }, [data])

  return (
    <BorrowMoreModal
      debtCurrency={position.underlying}
      collateral={position.collateral}
      onClose={onClose}
      value={value}
      setValue={setValue}
      maxLoanableAmount={max(
        min(maxLoanableAmountExcludingCouponFee - maxInterest, available),
        0n,
      )}
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
              position.amount + amount + interest,
              position.collateral,
              prices[position.collateral.underlying.address],
              position.collateralAmount,
            )
          : 0
      }
      interest={interest}
      actionButtonProps={{
        disabled:
          amount === 0n ||
          amount > available ||
          amount > maxLoanableAmountExcludingCouponFee - maxInterest,
        onClick: async () => {
          await borrowMore(position, amount, interest)
          setValue('')
          onClose()
        },
        text:
          amount === 0n
            ? 'Enter loan amount'
            : amount > available
            ? 'Not enough coupons for sale'
            : amount > maxLoanableAmountExcludingCouponFee - maxInterest
            ? 'Not enough collateral'
            : 'Borrow More',
      }}
      debtAssetPrice={prices[position.underlying.address]}
    />
  )
}

export default BorrowMoreModalContainer
