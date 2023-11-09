import React, { useCallback, useMemo, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { parseUnits } from 'viem'
import { useQuery } from 'wagmi'
import Image from 'next/image'
import Link from 'next/link'

import BackSvg from '../../components/svg/back-svg'
import { getLogo } from '../../model/currency'
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
import { convertToETH } from '../../utils/currency'
import { ETH_CURRENCY } from '../../constants/currency'

const Borrow = () => {
  const { selectedChain } = useChainContext()
  const { balances, prices, assets } = useCurrencyContext()
  const { borrow } = useBorrowContext()

  const [epochs, _setEpochs] = useState(0)
  const setEpochs = useCallback(
    (value: number) => {
      _setEpochs(value === epochs ? value - 1 : value)
    },
    [epochs],
  )

  const [collateralValue, setCollateralValue] = useState('')
  const [borrowValue, setBorrowValue] = useState('')
  const [collateral, setCollateral] = useState<Collateral | undefined>(
    undefined,
  )
  const [showCollateralSelect, setShowCollateralSelect] = useState(false)

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

  const [apy, available, interest, maxInterest] = useMemo(
    () =>
      epochs && interestsByEpochsBorrowed
        ? [
            interestsByEpochsBorrowed[epochs - 1].apy ?? 0,
            interestsByEpochsBorrowed[epochs - 1].available ?? 0n,
            interestsByEpochsBorrowed[epochs - 1].interest ?? 0n,
            interestsByEpochsBorrowed[epochs - 1].maxInterest ?? 0n,
          ]
        : [0, 0n, 0n, 0n],
    [epochs, interestsByEpochsBorrowed],
  )

  const minDebtSizeInEth = MIN_DEBT_SIZE_IN_ETH[selectedChain.id as CHAIN_IDS]
  const debtSizeInEth = convertToETH(
    selectedChain.id as CHAIN_IDS,
    prices,
    asset ? asset.underlying : ETH_CURRENCY[selectedChain.id as CHAIN_IDS],
    borrowAmount + interest,
  )
  const isDeptSizeLessThanMinDebtSize = debtSizeInEth.lt(minDebtSizeInEth)

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
              href="/"
            >
              <BackSvg className="w-4 h-4 sm:w-8 sm:h-8" />
              Borrow
              <div className="flex gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 relative">
                  <Image
                    src={getLogo(asset.underlying)}
                    alt={asset.underlying.name}
                    fill
                  />
                </div>
                <div>{asset.underlying.symbol}</div>
              </div>
            </Link>
            <div className="flex flex-col lg:flex-row sm:items-center lg:items-start justify-center gap-4 mb-4">
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
                showCollateralSelect={showCollateralSelect}
                setShowCollateralSelect={setShowCollateralSelect}
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
                    const hash = await borrow(
                      collateral,
                      collateralAmount,
                      asset,
                      borrowAmount,
                      epochs,
                      min(interest, maxInterest),
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
                      ? `Minimum debt size is ${minDebtSizeInEth} in ${
                          ETH_CURRENCY[selectedChain.id as CHAIN_IDS].symbol
                        }`
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
