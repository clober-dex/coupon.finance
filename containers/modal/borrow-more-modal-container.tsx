import React, { useMemo, useState } from 'react'
import { useQuery } from 'wagmi'
import { isAddressEqual, parseUnits } from 'viem'

import { LoanPosition } from '../../model/loan-position'
import { useCurrencyContext } from '../../contexts/currency-context'
import { fetchMarkets } from '../../apis/market'
import { calculateCouponsToBorrow } from '../../model/market'
import { LIQUIDATION_TARGET_LTV_PRECISION, max, min } from '../../utils/bigint'
import { dollarValue } from '../../utils/numbers'
import { useBorrowContext } from '../../contexts/borrow-context'
import BorrowMoreModal from '../../components/modal/borrow-more-modal'

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

  const amount = useMemo(
    () => (position ? parseUnits(value, position.underlying.decimals) : 0n),
    [position, value],
  )

  const maxLoanAmountExcludingCouponFee = useMemo(() => {
    const collateralPrice =
      prices[position.collateral.underlying.address]?.value ?? 0n
    const collateralComplement =
      10n ** BigInt(18 - position.collateral.underlying.decimals)
    const loanPrice = prices[position.underlying.address]?.value ?? 0n
    const loanComplement = 10n ** BigInt(18 - position.underlying.decimals)

    return loanPrice && collateralPrice
      ? (position.collateralAmount *
          BigInt(position.collateral.liquidationTargetLtv) *
          collateralPrice *
          collateralComplement) /
          (LIQUIDATION_TARGET_LTV_PRECISION * loanPrice * loanComplement)
      : 0n
  }, [position, prices])

  const { data } = useQuery(
    ['coupon-repurchase-fee-to-borrow', position.underlying.address, amount],
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
        maxLoanAmountExcludingCouponFee,
        amount,
      )
    },
    {
      keepPreviousData: true,
    },
  )

  const maxInterest = useMemo(() => data?.maxInterest ?? 0n, [data])
  const interest = useMemo(() => data?.interest ?? 0n, [data])
  const available = useMemo(() => data?.available ?? 0n, [data])
  const maxLoanAmount = useMemo(() => {
    return max(
      min(
        maxLoanAmountExcludingCouponFee - (data?.maxInterest ?? 0n),
        data?.available ?? 0n,
      ) - position.amount,
      0n,
    )
  }, [data, maxLoanAmountExcludingCouponFee, position.amount])

  const currentLtv = useMemo(
    () =>
      dollarValue(
        position.amount,
        position.underlying.decimals,
        prices[position.underlying.address],
      )
        .times(100)
        .div(
          dollarValue(
            position.collateralAmount,
            position.collateral.underlying.decimals,
            prices[position.collateral.underlying.address],
          ),
        )
        .toNumber(),
    [position, prices],
  )

  const expectedLtv = useMemo(() => {
    const collateralDollarValue = dollarValue(
      position.collateralAmount,
      position.collateral.underlying.decimals,
      prices[position.collateral.underlying.address],
    )
    const loanDollarValue = dollarValue(
      position.amount + amount + interest,
      position.underlying.decimals,
      prices[position.underlying.address],
    )
    return loanDollarValue.times(100).div(collateralDollarValue).toNumber()
  }, [position, amount, interest, prices])

  return (
    <BorrowMoreModal
      position={position}
      onClose={onClose}
      value={value}
      setValue={setValue}
      prices={prices}
      maxLoanAmount={maxLoanAmount}
      currentLtv={currentLtv}
      expectedLtv={expectedLtv}
      interest={interest}
      amount={amount}
      available={available}
      maxInterest={maxInterest}
      maxLoanAmountExcludingCouponFee={maxLoanAmountExcludingCouponFee}
      borrowMore={borrowMore}
    />
  )
}

export default BorrowMoreModalContainer
