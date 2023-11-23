import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { getAddress, isAddressEqual, zeroAddress } from 'viem'
import { usePublicClient, useQuery } from 'wagmi'
import BigNumber from 'bignumber.js'

import { useCurrencyContext } from '../../contexts/currency-context'
import { fetchBorrowApyByEpochsBorrowed } from '../../apis/market'
import { useBorrowContext } from '../../contexts/borrow-context'
import { Collateral, generateDummyCollateral } from '../../model/collateral'
import { calculateLtv, calculateMaxLoanableAmount } from '../../utils/ltv'
import { max, min } from '../../utils/bigint'
import { BorrowForm } from '../../components/form/borrow-form'
import { useChainContext } from '../../contexts/chain-context'
import { MIN_DEBT_SIZE_IN_ETH } from '../../constants/debt'
import { CHAIN_IDS } from '../../constants/chain'
import { ethValue } from '../../utils/currency'
import { buildPendingPosition } from '../../model/loan-position'
import { parseUnits } from '../../utils/numbers'
import { Currency } from '../../model/currency'

const BorrowFormContainer = ({
  defaultBorrowCurrency,
  defaultCollateralCurrency,
}: {
  defaultBorrowCurrency?: Currency
  defaultCollateralCurrency?: Currency
}) => {
  const { selectedChain } = useChainContext()
  const publicClient = usePublicClient()
  const { balances, prices, assets } = useCurrencyContext()
  const { borrow } = useBorrowContext()

  const [epochs, setEpochs] = useState(1)
  const [collateralValue, setCollateralValue] = useState('')
  const [borrowValue, setBorrowValue] = useState('')
  const [borrowCurrency, setBorrowCurrency] = useState<Currency | undefined>(
    defaultBorrowCurrency,
  )
  const [_collateral, setCollateral] = useState<Collateral | undefined>(
    defaultCollateralCurrency
      ? generateDummyCollateral(defaultCollateralCurrency)
      : undefined,
  )

  const router = useRouter()
  const asset = useMemo(() => {
    return borrowCurrency
      ? assets.find((asset) =>
          isAddressEqual(asset.underlying.address, borrowCurrency.address),
        )
      : undefined
  }, [assets, borrowCurrency])

  const collateral = useMemo(() => {
    return asset && _collateral
      ? asset.collaterals.find((collateral) =>
          isAddressEqual(
            collateral.underlying.address,
            _collateral.underlying.address,
          ),
        )
      : _collateral
  }, [_collateral, asset])

  const isCollateralFixed = defaultCollateralCurrency !== undefined

  const [collateralAmount, borrowAmount, collateralUserBalance] = useMemo(
    () => [
      parseUnits(
        collateralValue,
        collateral ? collateral.underlying.decimals : 18,
      ),
      parseUnits(borrowValue, asset ? asset.underlying.decimals : 18),
      collateral ? balances[collateral.underlying.address] ?? 0n : 0n,
    ],
    [collateralValue, collateral, borrowValue, asset, balances],
  )

  const maxLoanableAmountExcludingCouponFee = useMemo(
    () =>
      epochs &&
      collateral &&
      asset &&
      prices[asset.underlying.address] &&
      prices[collateral.underlying.address]
        ? calculateMaxLoanableAmount(
            asset.underlying,
            prices[asset.underlying.address],
            collateral,
            prices[collateral.underlying.address],
            collateralAmount,
          )
        : 0n,
    [asset, collateral, collateralAmount, epochs, prices],
  )

  const { data: interestsByEpochsBorrowed } = useQuery(
    [
      'borrow-simulate',
      asset,
      borrowAmount,
      maxLoanableAmountExcludingCouponFee,
      selectedChain,
    ], // TODO: useDebounce
    () =>
      asset
        ? fetchBorrowApyByEpochsBorrowed(
            selectedChain.id,
            asset,
            borrowAmount,
            maxLoanableAmountExcludingCouponFee,
          )
        : [],
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    },
  )

  const [apy, available, interest, maxInterest, endTimestamp] = useMemo(
    () =>
      epochs &&
      interestsByEpochsBorrowed &&
      interestsByEpochsBorrowed.length > 0
        ? [
            interestsByEpochsBorrowed[epochs - 1].apy ?? 0,
            interestsByEpochsBorrowed[epochs - 1].available ?? 0n,
            interestsByEpochsBorrowed[epochs - 1].interest ?? 0n,
            interestsByEpochsBorrowed[epochs - 1].maxInterest ?? 0n,
            interestsByEpochsBorrowed[epochs - 1].endTimestamp ?? 0,
          ]
        : [0, 0n, 0n, 0n, 0],
    [epochs, interestsByEpochsBorrowed],
  )

  const minDebtSizeInEth = MIN_DEBT_SIZE_IN_ETH[selectedChain.id as CHAIN_IDS]
  const debtSizeInEth = ethValue(
    selectedChain,
    prices[zeroAddress],
    asset?.underlying,
    borrowAmount + interest,
    prices[asset?.underlying?.address ?? zeroAddress],
  )
  const isDeptSizeLessThanMinDebtSize =
    debtSizeInEth.lt(minDebtSizeInEth) && debtSizeInEth.gt(0)

  if (!isCollateralFixed && !asset) {
    return <></>
  }
  if (isCollateralFixed && !collateral) {
    return <></>
  }

  return (
    <BorrowForm
      borrowCurrency={asset?.underlying}
      setBorrowCurrency={setBorrowCurrency}
      availableBorrowCurrencies={
        isCollateralFixed
          ? assets
              .filter((asset) =>
                asset.collaterals
                  .map((c) => getAddress(c.underlying.address))
                  .includes(getAddress(collateral!.underlying.address)),
              )
              .map((asset) => asset.underlying)
          : [asset!.underlying]
      }
      availableCollaterals={
        isCollateralFixed ? [collateral!] : asset!.collaterals
      }
      maxBorrowAmount={max(
        min(maxLoanableAmountExcludingCouponFee - maxInterest, available),
        0n,
      )}
      interest={interest}
      borrowApy={apy}
      borrowLTV={
        collateral &&
        asset &&
        prices[asset.underlying.address] &&
        prices[collateral?.underlying.address]
          ? calculateLtv(
              asset.underlying,
              prices[asset.underlying.address],
              borrowAmount + interest,
              collateral,
              prices[collateral?.underlying.address],
              collateralAmount,
            )
          : 0
      }
      interestsByEpochsBorrowed={
        interestsByEpochsBorrowed
          ? interestsByEpochsBorrowed.map(({ date, apy }) => ({
              date,
              apy,
            }))
          : undefined
      }
      collateral={collateral}
      setCollateral={setCollateral}
      collateralValue={collateralValue}
      setCollateralValue={setCollateralValue}
      borrowValue={borrowValue}
      setBorrowValue={setBorrowValue}
      epochs={epochs}
      setEpochs={setEpochs}
      balances={balances}
      prices={prices}
      actionButtonProps={{
        disabled:
          epochs === 0 ||
          collateralAmount === 0n ||
          borrowAmount === 0n ||
          collateralAmount > collateralUserBalance ||
          borrowAmount > available ||
          borrowAmount + maxInterest > maxLoanableAmountExcludingCouponFee ||
          isDeptSizeLessThanMinDebtSize,
        onClick: async () => {
          if (!collateral || !asset) {
            return
          }
          const { timestamp } = await publicClient.getBlock()
          const hash = await borrow(
            collateral,
            collateralAmount,
            asset,
            borrowAmount,
            epochs,
            min(interest, maxInterest),
            asset
              ? buildPendingPosition(
                  asset.substitutes[0],
                  asset.underlying,
                  collateral,
                  min(interest, maxInterest),
                  borrowAmount,
                  collateralAmount,
                  endTimestamp,
                  Number(timestamp),
                )
              : undefined,
          )
          if (hash) {
            await router.replace('/?mode=borrow')
          }
        },
        text:
          epochs === 0
            ? 'Select expiration date'
            : collateralAmount === 0n
            ? 'Enter collateral amount'
            : borrowAmount === 0n
            ? 'Enter loan amount'
            : collateralAmount > collateralUserBalance
            ? `Insufficient ${collateral?.underlying.symbol} balance`
            : borrowAmount > available
            ? 'Not enough coupons for sale'
            : borrowAmount + maxInterest > maxLoanableAmountExcludingCouponFee
            ? 'Not enough collateral'
            : isDeptSizeLessThanMinDebtSize
            ? `Remaining debt must be ≥ ${minDebtSizeInEth.toFixed(
                3,
                BigNumber.ROUND_CEIL,
              )} ETH`
            : 'Borrow',
      }}
    />
  )
}

export default BorrowFormContainer