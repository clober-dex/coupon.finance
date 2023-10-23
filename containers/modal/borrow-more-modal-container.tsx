import React, { useMemo, useState } from 'react'
import { useQuery } from 'wagmi'
import { isAddressEqual, parseUnits } from 'viem'

import { LoanPosition } from '../../model/loan-position'
import { useCurrencyContext } from '../../contexts/currency-context'
import { fetchMarkets } from '../../apis/market'
import { calculateCouponsToBorrow } from '../../model/market'
import { max, min } from '../../utils/bigint'
import { useBorrowContext } from '../../contexts/borrow-context'
import BorrowMoreModal from '../../components/modal/borrow-more-modal'
import { calculateLtv, calculateMaxLoanableAmount } from '../../utils/ltv'

const BorrowMoreModalContainer = ({
  position,
  onClose,
}: {
  position: LoanPosition
  onClose: () => void
}) => {
  const { borrowMore } = useBorrowContext()
  const { prices } = useCurrencyContext()
  const [value, setValue] = useState('')

  const borrowMoreAmount = useMemo(
    () => (position ? parseUnits(value, position.underlying.decimals) : 0n),
    [position, value],
  )

  const maxLoanableAmountExcludingCouponFee = useMemo(
    () =>
      prices[position.underlying.address] &&
      prices[position.collateral.underlying.address]
        ? calculateMaxLoanableAmount(
            position.underlying,
            prices[position.underlying.address],
            position.collateral,
            prices[position.collateral.underlying.address],
            position.collateralAmount,
          )
        : 0n,
    [
      position.collateral,
      position.collateralAmount,
      position.underlying,
      prices,
    ],
  )

  const { data } = useQuery(
    [
      'coupon-repurchase-fee-to-borrow',
      position.underlying.address,
      borrowMoreAmount,
    ],
    async () => {
      const markets = (await fetchMarkets())
        .filter((market) =>
          isAddressEqual(
            market.quoteToken.address,
            position.substitute.address,
          ),
        )
        .filter((market) => market.epoch <= position.toEpoch.id)
      return calculateCouponsToBorrow(
        position.substitute,
        markets,
        maxLoanableAmountExcludingCouponFee,
        borrowMoreAmount,
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
      position={position}
      onClose={onClose}
      currencyInputValue={value}
      setCurrencyInputValue={setValue}
      prices={prices}
      maxLoanableAmount={max(
        min(
          maxLoanableAmountExcludingCouponFee -
            maxInterest -
            (position.amount - position.interest),
          available,
        ),
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
              position.amount + borrowMoreAmount + interest,
              position.collateral,
              prices[position.collateral.underlying.address],
              position.collateralAmount,
            )
          : 0
      }
      interest={interest}
      borrowMoreAmount={borrowMoreAmount}
      available={available}
      maxInterest={maxInterest}
      maxLoanableAmountExcludingCouponFee={maxLoanableAmountExcludingCouponFee}
      borrowMore={borrowMore}
    />
  )
}

export default BorrowMoreModalContainer
