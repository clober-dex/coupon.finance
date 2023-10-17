import React, { useCallback, useMemo, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { isAddressEqual, parseUnits } from 'viem'
import { useQuery } from 'wagmi'
import Image from 'next/image'

import Slider from '../../components/slider'
import BackSvg from '../../components/svg/back-svg'
import { getLogo } from '../../model/currency'
import CurrencySelect from '../../components/currency-select'
import { useCurrencyContext } from '../../contexts/currency-context'
import CurrencyAmountInput from '../../components/currency-amount-input'
import { fetchBorrowAprByEpochsBorrowed } from '../../apis/market'
import { dollarValue, formatUnits } from '../../utils/numbers'
import { useBorrowContext } from '../../contexts/borrow-context'
import { LIQUIDATION_TARGET_LTV_PRECISION, min } from '../../utils/bigint'
import { Collateral } from '../../model/collateral'

const Borrow = () => {
  const { balances, prices, assets } = useCurrencyContext()
  const { borrow } = useBorrowContext()

  const [epochs, _setEpochs] = useState(0)
  const [collateralValue, setCollateralValue] = useState('')
  const [loanValue, setLoanValue] = useState('')
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

  const setEpochs = useCallback(
    (value: number) => {
      _setEpochs(value === epochs ? value - 1 : value)
    },
    [epochs],
  )

  const collateralAmount = useMemo(
    () => parseUnits(collateralValue, collateral?.underlying.decimals ?? 18),
    [collateralValue, collateral?.underlying.decimals],
  )
  const collateralBalance = useMemo(
    () => (collateral ? balances[collateral.underlying.address] ?? 0n : 0n),
    [balances, collateral],
  )

  const loanAmount = useMemo(
    () => parseUnits(loanValue, asset?.underlying.decimals ?? 18),
    [loanValue, asset?.underlying.decimals],
  )

  const liquidationTargetLtv = useMemo(
    () => BigInt(collateral?.liquidationTargetLtv ?? '0'),
    [collateral],
  )

  const maxLoanAmountExcludingCouponFee = useMemo(() => {
    if (epochs === 0 || !collateral || !asset) {
      return 0n
    }
    const collateralPrice = prices[collateral.underlying.address]?.value ?? 0n
    const collateralComplement =
      10n ** BigInt(18 - collateral.underlying.decimals)
    const loanPrice = prices[asset.underlying.address]?.value ?? 0n
    const loanComplement = 10n ** BigInt(18 - asset.underlying.decimals)

    return loanPrice && collateralPrice
      ? (collateralAmount *
          liquidationTargetLtv *
          collateralPrice *
          collateralComplement) /
          (LIQUIDATION_TARGET_LTV_PRECISION * loanPrice * loanComplement)
      : 0n
  }, [
    asset,
    collateral,
    collateralAmount,
    epochs,
    liquidationTargetLtv,
    prices,
  ])

  const { data: interestsByEpochsBorrowed } = useQuery(
    ['borrow-apr', asset, loanAmount, maxLoanAmountExcludingCouponFee], // TODO: useDebounce
    () =>
      asset
        ? fetchBorrowAprByEpochsBorrowed(
            asset,
            loanAmount,
            maxLoanAmountExcludingCouponFee,
          )
        : [],
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    },
  )

  const available = useMemo(() => {
    if (epochs === 0 || !interestsByEpochsBorrowed) {
      return 0n
    }
    return interestsByEpochsBorrowed[epochs - 1]?.available ?? 0n
  }, [epochs, interestsByEpochsBorrowed])

  const borrowApr = useMemo(() => {
    if (epochs === 0 || !interestsByEpochsBorrowed) {
      return 0
    }
    return interestsByEpochsBorrowed[epochs - 1]?.apr ?? 0
  }, [epochs, interestsByEpochsBorrowed])

  const expectedInterest = useMemo(() => {
    if (epochs === 0 || !interestsByEpochsBorrowed) {
      return 0n
    }
    return interestsByEpochsBorrowed[epochs - 1]?.interest ?? 0n
  }, [epochs, interestsByEpochsBorrowed])

  const maxInterest = useMemo(() => {
    if (epochs === 0 || !interestsByEpochsBorrowed) {
      return 0n
    }
    return interestsByEpochsBorrowed[epochs - 1]?.maxInterest ?? 0n
  }, [epochs, interestsByEpochsBorrowed])

  const maxLoanAmount = useMemo(() => {
    if (
      epochs === 0 ||
      !interestsByEpochsBorrowed ||
      !maxLoanAmountExcludingCouponFee
    ) {
      return 0n
    }
    return min(
      maxLoanAmountExcludingCouponFee -
        interestsByEpochsBorrowed[epochs - 1]?.maxInterest ?? 0n,
      interestsByEpochsBorrowed[epochs - 1]?.available ?? 0n,
    )
  }, [epochs, interestsByEpochsBorrowed, maxLoanAmountExcludingCouponFee])

  const currentLtv = useMemo(() => {
    if (epochs === 0 || !interestsByEpochsBorrowed || !asset) {
      return 0
    }
    const collateralDollarValue = collateral
      ? dollarValue(
          collateralAmount,
          collateral.underlying.decimals,
          prices[collateral.underlying.address],
        )
      : 0
    const loanDollarValue = dollarValue(
      loanAmount + expectedInterest,
      asset.underlying.decimals,
      prices[asset.underlying.address],
    )
    return loanDollarValue.times(100).div(collateralDollarValue).toNumber()
  }, [
    asset,
    collateral,
    collateralAmount,
    epochs,
    expectedInterest,
    interestsByEpochsBorrowed,
    loanAmount,
    prices,
  ])

  return (
    <div className="flex flex-1">
      <Head>
        <title>Borrow {asset?.underlying.symbol}</title>
      </Head>
      {asset ? (
        <main className="flex flex-1 flex-col justify-center items-center">
          <div className="flex flex-1 flex-col w-full">
            <button
              className="flex items-center font-bold text-base sm:text-2xl gap-2 sm:gap-3 mt-24 mb-2 sm:mb-2 ml-4 sm:ml-6"
              onClick={() => router.back()}
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
            </button>
            {showCollateralSelect ? (
              <CurrencySelect
                currencies={asset.collaterals
                  .filter(
                    ({ underlying }) =>
                      !isAddressEqual(
                        underlying.address,
                        asset.underlying.address,
                      ),
                  )
                  .map((collateral) => collateral.underlying)}
                onBack={() => setShowCollateralSelect(false)}
                onCurrencySelect={(currency) => {
                  setCollateral(
                    asset.collaterals.find(({ underlying }) => {
                      return isAddressEqual(
                        underlying.address,
                        currency.address,
                      )
                    }),
                  )
                  setShowCollateralSelect(false)
                }}
                prices={prices}
                balances={balances}
              />
            ) : (
              <div className="flex flex-1 sm:items-center justify-center">
                <div className="flex flex-col sm:shadow bg-gray-50 dark:bg-gray-900 sm:rounded-3xl p-4 sm:p-6 w-full sm:w-[480px] gap-8">
                  <div className="flex flex-col gap-4">
                    <div className="font-bold text-sm sm:text-lg">
                      How much collateral would you like to add?
                    </div>
                    <CurrencyAmountInput
                      currency={collateral?.underlying}
                      value={collateralValue}
                      onValueChange={setCollateralValue}
                      availableBalance={
                        collateral
                          ? balances[collateral?.underlying.address] ?? 0n
                          : 0n
                      }
                      price={
                        collateral
                          ? prices[collateral?.underlying.address]
                          : undefined
                      }
                      onCurrencyClick={() => setShowCollateralSelect(true)}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="font-bold text-sm sm:text-lg">
                      How much would you like to borrow?
                    </div>
                    <CurrencyAmountInput
                      currency={asset.underlying}
                      value={loanValue}
                      onValueChange={setLoanValue}
                      price={prices[asset.underlying.address]}
                      availableBalance={maxLoanAmount}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="font-bold text-sm sm:text-lg">
                      Select expiration date.
                    </div>
                    <div className="flex flex-row-reverse justify-between sm:flex-col relative bg-white dark:bg-gray-800 rounded-lg p-4">
                      <div className="sm:px-6 sm:mb-2">
                        <div>
                          <Slider
                            length={interestsByEpochsBorrowed?.length ?? 0}
                            value={epochs}
                            onValueChange={setEpochs}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between">
                        {(interestsByEpochsBorrowed || []).map(
                          ({ date }, i) => (
                            <button
                              key={i}
                              className="flex flex-col items-center gap-2 w-[72px]"
                              onClick={() => setEpochs(i + 1)}
                            >
                              <div className="text-sm">{date}</div>
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex w-full sm:w-fit text-sm gap-2 justify-between">
                        <span className="text-gray-500">APR</span>
                        <div className="flex gap-1">
                          <div className="text-gray-800 dark:text-white">
                            {borrowApr.toFixed(2)}%
                          </div>
                          <div className="text-gray-400">
                            (
                            {formatUnits(
                              expectedInterest,
                              asset.underlying.decimals,
                              prices[asset.underlying.address],
                            )}{' '}
                            {asset.underlying.symbol} in interest)
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full sm:w-fit text-sm gap-2 justify-between">
                        <span className="text-gray-500">LTV</span>
                        <div className="text-yellow-500">
                          {currentLtv.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    disabled={
                      epochs === 0 ||
                      collateralAmount === 0n ||
                      loanAmount === 0n ||
                      collateralAmount > collateralBalance ||
                      loanAmount > available ||
                      loanAmount + maxInterest > maxLoanAmountExcludingCouponFee
                    }
                    className="font-bold text-base sm:text-xl bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
                    onClick={async () => {
                      if (!collateral) {
                        return
                      }
                      const hash = await borrow(
                        collateral,
                        collateralAmount,
                        asset,
                        loanAmount,
                        epochs,
                        expectedInterest,
                      )
                      if (hash) {
                        await router.replace('/?mode=borrow')
                      }
                    }}
                  >
                    {epochs === 0
                      ? 'Select expiration date'
                      : collateralAmount === 0n
                      ? 'Enter collateral amount'
                      : loanAmount === 0n
                      ? 'Enter loan amount'
                      : collateralAmount > collateralBalance
                      ? `Insufficient ${collateral?.underlying.symbol} balance`
                      : loanAmount > available
                      ? 'Not enough coupons for sale'
                      : loanAmount + maxInterest >
                        maxLoanAmountExcludingCouponFee
                      ? 'Not enough collateral'
                      : 'Borrow'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Borrow
