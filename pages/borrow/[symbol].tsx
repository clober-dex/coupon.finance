import React, { useCallback, useMemo, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { isAddressEqual, parseUnits } from 'viem'
import { useQuery } from 'wagmi'

import Slider from '../../components/slider'
import BackSvg from '../../components/svg/back-svg'
import { Currency, getLogo } from '../../model/currency'
import { Asset } from '../../model/asset'
import { fetchAssets } from '../../api/asset'
import CurrencySelect from '../../components/currency-select'
import { useCurrencyContext } from '../../contexts/currency-context'
import CurrencyAmountInput from '../../components/currency-amount-input'
import { fetchBorrowAprByEpochsBorrowed } from '../../api/market'
import { dollarValue, formatUnits } from '../../utils/numbers'
import { ClientComponent } from '../../components/client-component'
import { useBorrowContext } from '../../contexts/borrow-context'
import { min } from '../../utils/bigint'

const LIQUIDATION_TARGET_LTV_PRECISION = 10n ** 6n

export const getServerSideProps: GetServerSideProps<{
  asset: Asset
}> = async ({ params }) => {
  const assets = await fetchAssets()
  const asset = assets.find(
    ({ underlying }) => underlying.symbol === params?.symbol,
  )
  if (!asset) {
    return {
      notFound: true,
    }
  }

  return {
    props: { asset },
  }
}

const Borrow: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ asset }) => {
  const { balances, prices, rawPrices } = useCurrencyContext()
  const { borrow } = useBorrowContext()

  const [epochs, _setEpochs] = useState(0)
  const [collateralValue, setCollateralValue] = useState('')
  const [loanValue, setLoanValue] = useState('')
  const [collateral, setCollateral] = useState<Currency | undefined>(undefined)
  const [showCollateralSelect, setShowCollateralSelect] = useState(false)

  const router = useRouter()

  const setEpochs = useCallback(
    (value: number) => {
      _setEpochs(value === epochs ? value - 1 : value)
    },
    [epochs],
  )

  const collateralAmount = useMemo(
    () => parseUnits(collateralValue, collateral?.decimals ?? 18),
    [collateralValue, collateral?.decimals],
  )
  const collateralBalance = useMemo(
    () => (collateral ? balances[collateral.address] : 0n),
    [balances, collateral],
  )

  const loanAmount = useMemo(
    () => parseUnits(loanValue, asset.underlying.decimals),
    [loanValue, asset.underlying.decimals],
  )

  const maxLiquidationTargetLtv = useMemo(
    () =>
      collateral
        ? BigInt(
            asset.collaterals.find(({ underlying }) =>
              isAddressEqual(underlying.address, collateral.address),
            )?.liquidationTargetLtv || 0n,
          )
        : 0n,
    [asset.collaterals, collateral],
  )

  const maxLoanAmountExcludingCouponFee = useMemo(() => {
    if (epochs === 0 || !collateral || !asset) {
      return 0n
    }
    const collateralPrice = rawPrices[collateral.address] ?? 0n
    const collateralComplement = 10n ** BigInt(18 - collateral.decimals)
    const loanPrice = rawPrices[asset.underlying.address] ?? 0n
    const loanComplement = 10n ** BigInt(18 - asset.underlying.decimals)

    return loanPrice && collateralPrice
      ? (collateralAmount *
          maxLiquidationTargetLtv *
          collateralPrice *
          collateralComplement) /
          (LIQUIDATION_TARGET_LTV_PRECISION * loanPrice * loanComplement)
      : 0n
  }, [
    asset,
    collateral,
    collateralAmount,
    epochs,
    maxLiquidationTargetLtv,
    rawPrices,
  ])

  const { data: interestsByEpochsBorrowed } = useQuery(
    ['borrow-apr', asset, loanAmount, maxLoanAmountExcludingCouponFee], // TODO: useDebounce
    () =>
      fetchBorrowAprByEpochsBorrowed(
        asset,
        loanAmount,
        maxLoanAmountExcludingCouponFee,
      ),
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

  const ltv = useMemo(() => {
    if (epochs === 0 || !interestsByEpochsBorrowed) {
      return 0
    }
    const collateralDollarValue = collateral
      ? dollarValue(
          collateralAmount,
          collateral.decimals,
          prices[collateral.address],
        )
      : 0
    const loanDollarValue = dollarValue(
      loanAmount,
      asset.underlying.decimals,
      prices[asset.underlying.address] ?? 0,
    )
    return loanDollarValue.times(100).div(collateralDollarValue).toNumber()
  }, [
    asset.underlying.address,
    asset.underlying.decimals,
    collateral,
    collateralAmount,
    epochs,
    interestsByEpochsBorrowed,
    loanAmount,
    prices,
  ])

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
              <img
                src={getLogo(asset.underlying)}
                alt={asset.underlying.name}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
              <div>{asset.underlying.symbol}</div>
            </div>
          </button>
          {showCollateralSelect ? (
            <CurrencySelect
              currencies={asset.collaterals.map(
                (collateral) => collateral.underlying,
              )}
              onBack={() => setShowCollateralSelect(false)}
              onCurrencySelect={(currency) => {
                setCollateral(currency)
                setShowCollateralSelect(false)
              }}
            />
          ) : (
            <div className="flex flex-1 sm:items-center justify-center">
              <div className="flex flex-col sm:shadow bg-gray-50 dark:bg-gray-900 sm:rounded-3xl p-4 sm:p-6 w-full sm:w-[480px] gap-8">
                <div className="flex flex-col gap-4">
                  <div className="font-bold text-sm sm:text-lg">
                    How much collateral would you like to add?
                  </div>
                  <CurrencyAmountInput
                    currency={collateral}
                    value={collateralValue}
                    onValueChange={setCollateralValue}
                    balance={
                      collateral ? balances[collateral?.address] ?? 0n : 0n
                    }
                    price={collateral ? prices[collateral?.address] ?? 0 : 0}
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
                    price={prices[asset.underlying.address] ?? 0}
                    balance={maxLoanAmount}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="font-bold text-sm sm:text-lg">
                    Select expiration date.
                  </div>
                  <div className="flex flex-row-reverse justify-between sm:flex-col relative bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="sm:px-6 sm:mb-2">
                      <Slider
                        length={4}
                        value={epochs}
                        onValueChange={setEpochs}
                      />
                    </div>
                    <ClientComponent className="flex flex-col sm:flex-row justify-between">
                      {(interestsByEpochsBorrowed || []).map(({ date }, i) => (
                        <button
                          key={i}
                          className="flex flex-col items-center gap-2 w-[72px]"
                          onClick={() => setEpochs(i + 1)}
                        >
                          <div className="text-sm">{date}</div>
                        </button>
                      ))}
                    </ClientComponent>
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
                            prices[asset.underlying.address] ?? 0,
                          )}{' '}
                          {asset.underlying.symbol} in interest)
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full sm:w-fit text-sm gap-2 justify-between">
                      <span className="text-gray-500">LTV</span>
                      <div className="text-yellow-500">{ltv.toFixed(2)}%</div>
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
                      await router.replace('/')
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
                    ? 'Not enough collateral'
                    : loanAmount > available
                    ? 'Not enough coupons for sale'
                    : loanAmount + maxInterest > maxLoanAmountExcludingCouponFee
                    ? 'Loan LTV too high'
                    : 'Borrow'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Borrow
