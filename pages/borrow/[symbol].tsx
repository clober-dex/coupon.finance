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
import { formatUnits } from '../../utils/numbers'
import { useBorrowContext } from '../../contexts/borrow-context'
import { Collateral } from '../../model/collateral'
import { calculateLtv, calculateMaxLoanableAmount } from '../../utils/ltv'
import { max, min } from '../../utils/bigint'
import { ActionButton } from '../../components/action-button'

const Borrow = () => {
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
    return (
      assets.find((asset) => asset.underlying.symbol === router.query.symbol) ||
      assets[0]
    )
  }, [assets, router.query.symbol])

  const [collateralAmount, borrowAmount, collateralUserBalance] = useMemo(
    () => [
      parseUnits(
        collateralValue,
        collateral ? collateral.underlying.decimals : 18,
      ),
      parseUnits(borrowValue, asset.underlying.decimals),
      collateral ? balances[collateral.underlying.address] ?? 0n : 0n,
    ],
    [collateralValue, collateral, borrowValue, asset, balances],
  )

  const maxLoanableAmountExcludingCouponFee = useMemo(
    () =>
      epochs &&
      collateral &&
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
    ], // TODO: useDebounce
    () =>
      fetchBorrowAprByEpochsBorrowed(
        asset,
        borrowAmount,
        maxLoanableAmountExcludingCouponFee,
      ),
    {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    },
  )

  const [apr, available, interest, maxInterest] = useMemo(
    () =>
      epochs && interestsByEpochsBorrowed
        ? [
            interestsByEpochsBorrowed[epochs - 1].apr ?? 0,
            interestsByEpochsBorrowed[epochs - 1].available ?? 0n,
            interestsByEpochsBorrowed[epochs - 1].interest ?? 0n,
            interestsByEpochsBorrowed[epochs - 1].maxInterest ?? 0n,
          ]
        : [0, 0n, 0n, 0n],
    [epochs, interestsByEpochsBorrowed],
  )

  return (
    <div className="flex flex-1">
      <Head>
        <title>Borrow {asset.underlying.symbol}</title>
      </Head>

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
                    return isAddressEqual(underlying.address, currency.address)
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
                    availableAmount={
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
                    value={borrowValue}
                    onValueChange={setBorrowValue}
                    price={prices[asset.underlying.address]}
                    availableAmount={max(
                      min(
                        maxLoanableAmountExcludingCouponFee - maxInterest,
                        available,
                      ),
                      0n,
                    )}
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
                      {(interestsByEpochsBorrowed || []).map(({ date }, i) => (
                        <button
                          key={i}
                          className="flex flex-col items-center gap-2 w-[72px]"
                          onClick={() => setEpochs(i + 1)}
                        >
                          <div className="text-sm">{date}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex w-full sm:w-fit text-sm gap-2 justify-between">
                      <span className="text-gray-500">APR</span>
                      <div className="flex gap-1">
                        <div className="text-gray-800 dark:text-white">
                          {apr.toFixed(2)}%
                        </div>
                        <div className="text-gray-400">
                          (
                          {formatUnits(
                            interest,
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
                        {collateral &&
                        prices[asset.underlying.address] &&
                        prices[collateral?.underlying.address]
                          ? calculateLtv(
                              asset.underlying,
                              prices[asset.underlying.address],
                              borrowAmount + interest,
                              collateral,
                              prices[collateral?.underlying.address],
                              collateralAmount,
                            ).toFixed(2)
                          : 0}
                        %
                      </div>
                    </div>
                  </div>
                </div>
                <ActionButton
                  disabled={
                    epochs === 0 ||
                    collateralAmount === 0n ||
                    borrowAmount === 0n ||
                    collateralAmount > collateralUserBalance ||
                    borrowAmount > available ||
                    borrowAmount + maxInterest >
                      maxLoanableAmountExcludingCouponFee
                  }
                  onClick={async () => {
                    if (!collateral) {
                      return
                    }
                    const hash = await borrow(
                      collateral,
                      collateralAmount,
                      asset,
                      borrowAmount,
                      epochs,
                      interest,
                    )
                    if (hash) {
                      await router.replace('/?mode=borrow')
                    }
                  }}
                  text={
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
                      : 'Borrow'
                  }
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Borrow
