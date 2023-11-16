import React, { useMemo, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { zeroAddress } from 'viem'
import { usePublicClient, useQuery } from 'wagmi'
import Link from 'next/link'
import BigNumber from 'bignumber.js'

import BackSvg from '../../components/svg/back-svg'
import { useCurrencyContext } from '../../contexts/currency-context'
import { fetchBorrowApyByEpochsBorrowed } from '../../apis/market'
import { useBorrowContext } from '../../contexts/borrow-context'
import { Collateral } from '../../model/collateral'
import { calculateLtv, calculateMaxLoanableAmount } from '../../utils/ltv'
import { max, min } from '../../utils/bigint'
import { BorrowForm } from '../../components/form/borrow-form'
import { useChainContext } from '../../contexts/chain-context'
import { MIN_DEBT_SIZE_IN_ETH } from '../../constants/debt'
import { CHAIN_IDS } from '../../constants/chain'
import { ethValue } from '../../utils/currency'
import { CurrencyIcon } from '../../components/icon/currency-icon'
import { buildPendingPosition } from '../../model/loan-position'
import { parseUnits } from '../../utils/numbers'

const Borrow = () => {
  const { selectedChain } = useChainContext()
  const publicClient = usePublicClient()
  const { balances, prices, assets } = useCurrencyContext()
  const { borrow } = useBorrowContext()

  const [epochs, setEpochs] = useState(1)
  const [collateralValue, setCollateralValue] = useState('')
  const [borrowValue, setBorrowValue] = useState('')
  const [collateral, setCollateral] = useState<Collateral | undefined>(
    undefined,
  )

  const router = useRouter()
  const asset = useMemo(() => {
    return assets.find(
      (asset) => asset.underlying.symbol === router.query.symbol,
    )
  }, [assets, router.query.symbol])

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

  return (
    <div className="flex flex-1">
      <Head>
        <title>Borrow {asset?.underlying.symbol}</title>
      </Head>

      {asset ? (
        <main className="flex flex-1 flex-col justify-center items-center">
          <div className="flex flex-1 flex-col w-full gap-6">
            <Link
              className="flex items-center font-bold text-base sm:text-2xl gap-2 sm:gap-3 mt-4 mb-2 sm:mb-2 ml-4 sm:ml-6"
              replace={true}
              href="/?mode=borrow"
            >
              <BackSvg className="w-4 h-4 sm:w-8 sm:h-8" />
              Borrow
              <div className="flex gap-2">
                <CurrencyIcon
                  currency={asset.underlying}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
                <div>{asset.underlying.symbol}</div>
              </div>
            </Link>
            <div className="flex flex-col lg:flex-row sm:items-center lg:items-start justify-center gap-4 mb-4 px-2 md:px-0">
              <BorrowForm
                borrowCurrency={asset.underlying}
                availableCollaterals={asset.collaterals}
                maxBorrowAmount={max(
                  min(
                    maxLoanableAmountExcludingCouponFee - maxInterest,
                    available,
                  ),
                  0n,
                )}
                interest={interest}
                borrowApy={apy}
                borrowLTV={
                  collateral &&
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
                    borrowAmount + maxInterest >
                      maxLoanableAmountExcludingCouponFee ||
                    isDeptSizeLessThanMinDebtSize,
                  onClick: async () => {
                    if (!collateral) {
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
                      : borrowAmount + maxInterest >
                        maxLoanableAmountExcludingCouponFee
                      ? 'Not enough collateral'
                      : isDeptSizeLessThanMinDebtSize
                      ? `Remaining debt must be ≥ ${minDebtSizeInEth.toFixed(
                          3,
                          BigNumber.ROUND_CEIL,
                        )} ETH`
                      : 'Borrow',
                }}
              />
            </div>
          </div>
        </main>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Borrow
