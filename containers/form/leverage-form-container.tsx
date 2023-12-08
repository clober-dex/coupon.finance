import React, { useEffect, useMemo, useState } from 'react'
import { isAddressEqual, zeroAddress } from 'viem'
import { useFeeData, usePublicClient, useQuery } from 'wagmi'
import BigNumber from 'bignumber.js'
import { useRouter } from 'next/router'
import Link from 'next/link'

import {
  isStableCoin,
  useCurrencyContext,
} from '../../contexts/currency-context'
import { fetchBorrowApyByEpochsBorrowed } from '../../apis/market'
import { Collateral, generateDummyCollateral } from '../../model/collateral'
import { calculateLtv, calculateMaxLoanableAmount } from '../../utils/ltv'
import { useChainContext } from '../../contexts/chain-context'
import { MIN_DEBT_SIZE_IN_ETH } from '../../constants/debt'
import { CHAIN_IDS } from '../../constants/chain'
import { ethValue } from '../../utils/currency'
import { formatUnits, parseUnits } from '../../utils/numbers'
import { Currency } from '../../model/currency'
import { HelperModalButton } from '../../components/button/helper-modal-button'
import { LeverageForm } from '../../components/form/leverage-form'
import { fetchAmountOutByOdos, fetchCallDataByOdos } from '../../apis/odos'
import { applyPercent, min } from '../../utils/bigint'
import { buildPendingPosition } from '../../model/loan-position'
import { useBorrowContext } from '../../contexts/borrow-context'
import { CONTRACT_ADDRESSES } from '../../constants/addresses'
import BackSvg from '../../components/svg/back-svg'
import { CurrencyIcon } from '../../components/icon/currency-icon'
import { ChartContainer } from '../chart-container'

const SLIPPAGE_LIMIT_PERCENT = 0.5

const getWindowSize = () => {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 }
  }
  return { width: window.innerWidth, height: window.innerHeight }
}

const LeverageFormContainer = ({
  showHelperModal,
  setShowHelperModal,
  setHelperModalOutputCurrency,
  defaultDebtCurrency,
  defaultCollateralCurrency,
  children,
}: {
  showHelperModal: boolean
  setShowHelperModal: (value: boolean) => void
  setHelperModalOutputCurrency: (value: Currency | undefined) => void
  defaultDebtCurrency?: Currency
  defaultCollateralCurrency?: Currency
} & React.PropsWithChildren) => {
  const { selectedChain } = useChainContext()
  const publicClient = usePublicClient()
  const { data: feeData } = useFeeData()
  const { balances, prices, assets, epochs: allEpochs } = useCurrencyContext()
  const { leverage } = useBorrowContext()

  const [windowSize, setWindowSize] = useState(getWindowSize())
  const [epochs, setEpochs] = useState(0)
  const [multiple, setMultiple] = useState(2)
  const [multipleBuffer, setMultipleBuffer] = useState({
    previous: multiple,
    updateAt: Date.now(),
  })
  const [collateralValue, setCollateralValue] = useState('')
  const [borrowCurrency, setBorrowCurrency] = useState<Currency | undefined>(
    defaultDebtCurrency,
  )
  const targetCurrency = useMemo(
    () => defaultCollateralCurrency ?? defaultDebtCurrency,
    [defaultCollateralCurrency, defaultDebtCurrency],
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
  const availableDebtCurrencies = useMemo(() => {
    const debtCurrencies = assets
      .map((asset) => asset.underlying)
      .filter((currency, index, self) =>
        self.findIndex((c) => isAddressEqual(c.address, currency.address)) ===
        index
          ? currency
          : undefined,
      )
    return defaultDebtCurrency
      ? [defaultDebtCurrency] // short or fixed debt currency
      : defaultCollateralCurrency
      ? // else, long
        debtCurrencies.filter(
          (currency) =>
            !isAddressEqual(
              currency.address,
              defaultCollateralCurrency.address,
            ),
        )
      : debtCurrencies
  }, [assets, defaultCollateralCurrency, defaultDebtCurrency])
  const availableCollaterals = useMemo(
    () =>
      !isCollateralFixed && asset
        ? asset.collaterals.filter((collateral) =>
            isStableCoin(collateral.underlying),
          ) // short
        : [], // else, long or fixed collateral currency
    [asset, isCollateralFixed],
  )

  useEffect(() => {
    if (collateral) {
      setHelperModalOutputCurrency(collateral.underlying)
    }
  }, [collateral, setHelperModalOutputCurrency])

  const [inputCollateralAmount, collateralUserBalance] = useMemo(
    () => [
      parseUnits(
        collateralValue,
        collateral ? collateral.underlying.decimals : 18,
      ),
      collateral ? balances[collateral.underlying.address] ?? 0n : 0n,
    ],
    [collateralValue, collateral, balances],
  )

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        Date.now() - multipleBuffer.updateAt > 100 &&
        multipleBuffer.previous !== multiple
      ) {
        setMultipleBuffer({
          previous: multiple,
          updateAt: Date.now(),
        })
      }
    }, 250)
    return () => clearInterval(interval)
  }, [multiple, multipleBuffer.previous, multipleBuffer.updateAt])

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(getWindowSize())
    }
    window.addEventListener('resize', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  const isMobile = useMemo(() => windowSize.width < 640, [windowSize])

  // ready to calculate
  const {
    data: {
      pathId,
      debtAmountWithoutCouponFee,
      maxLoanableAmountExcludingCouponFee,
      collateralAmount,
      interestsByEpochsBorrowed,
    },
  } = useQuery(
    [
      'leverage-simulate',
      collateral?.underlying.symbol,
      inputCollateralAmount,
      multipleBuffer,
      asset?.underlying.symbol,
      selectedChain,
    ], // TODO: useDebounce
    async () => {
      if (
        !feeData?.gasPrice ||
        !collateral ||
        !asset ||
        multiple === 1 ||
        inputCollateralAmount === 0n
      ) {
        return {
          pathId: undefined,
          debtAmountWithoutCouponFee: 0n,
          maxLoanableAmountExcludingCouponFee: 0n,
          collateralAmount: 0n,
          interestsByEpochsBorrowed: [],
        }
      }

      const borrowedCollateralAmount = applyPercent(
        inputCollateralAmount,
        (multiple - 1) * 100,
      )
      const maxLoanableAmountExcludingCouponFee =
        prices[asset.underlying.address] &&
        prices[collateral.underlying.address]
          ? calculateMaxLoanableAmount(
              asset.underlying,
              prices[asset.underlying.address],
              collateral,
              prices[collateral.underlying.address],
              inputCollateralAmount + borrowedCollateralAmount,
            )
          : 0n
      const { amountOut: debtAmountWithoutCouponFee } =
        await fetchAmountOutByOdos({
          chainId: selectedChain.id,
          amountIn: borrowedCollateralAmount.toString(),
          tokenIn: collateral.underlying.address,
          tokenOut: asset.underlying.address,
          slippageLimitPercent: SLIPPAGE_LIMIT_PERCENT,
          gasPrice: Number(feeData.gasPrice),
        })

      const [interestsByEpochsBorrowed, { pathId }] = await Promise.all([
        fetchBorrowApyByEpochsBorrowed(
          selectedChain.id,
          asset,
          debtAmountWithoutCouponFee,
          maxLoanableAmountExcludingCouponFee,
        ),
        fetchAmountOutByOdos({
          chainId: selectedChain.id,
          amountIn: debtAmountWithoutCouponFee.toString(),
          tokenIn: asset.underlying.address,
          tokenOut: collateral.underlying.address,
          slippageLimitPercent: SLIPPAGE_LIMIT_PERCENT,
          userAddress:
            CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
          gasPrice: Number(feeData.gasPrice),
        }),
      ])

      return {
        pathId,
        debtAmountWithoutCouponFee,
        maxLoanableAmountExcludingCouponFee,
        collateralAmount: inputCollateralAmount + borrowedCollateralAmount,
        interestsByEpochsBorrowed,
      }
    },
    {
      refetchInterval: 10 * 1000,
      refetchIntervalInBackground: true,
      initialData: {
        pathId: undefined,
        debtAmountWithoutCouponFee: 0n,
        maxLoanableAmountExcludingCouponFee: 0n,
        collateralAmount: 0n,
        interestsByEpochsBorrowed: [],
      },
    },
  )

  const [apy, available, interest, maxInterest, endTimestamp] = useMemo(
    () =>
      interestsByEpochsBorrowed && interestsByEpochsBorrowed.length > 0
        ? [
            interestsByEpochsBorrowed[epochs].apy ?? 0,
            interestsByEpochsBorrowed[epochs].available ?? 0n,
            interestsByEpochsBorrowed[epochs].interest ?? 0n,
            interestsByEpochsBorrowed[epochs].maxInterest ?? 0n,
            interestsByEpochsBorrowed[epochs].endTimestamp ?? 0,
          ]
        : [0, 0n, 0n, 0n, 0],
    [epochs, interestsByEpochsBorrowed],
  )

  const minDebtSizeInEth = MIN_DEBT_SIZE_IN_ETH[selectedChain.id as CHAIN_IDS]
  const debtSizeInEth = ethValue(
    prices[zeroAddress],
    asset?.underlying,
    debtAmountWithoutCouponFee + interest,
    prices[asset?.underlying?.address ?? zeroAddress],
    selectedChain.nativeCurrency.decimals,
  )
  const isDeptSizeLessThanMinDebtSize =
    debtSizeInEth.lt(minDebtSizeInEth) && debtSizeInEth.gt(0)

  if (!router.query.symbol || !router.query.symbol.toString().includes('_')) {
    return <></>
  }

  if (!isCollateralFixed && !asset) {
    return <></>
  }
  if (isCollateralFixed && !collateral) {
    return <></>
  }
  const latestWord = router.query.symbol.toString().split('_')[1]
  const leveragePosition =
    latestWord === 'LONG'
      ? 'Long'
      : latestWord === 'SHORT'
      ? 'Short'
      : collateral && asset
      ? isStableCoin(collateral.underlying) && !isStableCoin(asset.underlying)
        ? 'Short'
        : 'Long'
      : ''

  return (
    <main className="flex flex-1 flex-col justify-center items-center">
      <div className="flex flex-1 flex-col w-full gap-6">
        <Link
          className="flex items-center font-bold text-base sm:text-2xl gap-2 sm:gap-3 mt-4 mb-2 sm:mb-2 ml-4 sm:ml-6"
          replace={true}
          href="/?mode=borrow"
        >
          <BackSvg className="w-4 h-4 sm:w-8 sm:h-8" />
          {leveragePosition}{' '}
          <div className="flex gap-2">
            <CurrencyIcon
              currency={
                leveragePosition === 'Long' && collateral
                  ? collateral.underlying
                  : leveragePosition === 'Short' && asset
                  ? asset.underlying
                  : { ...selectedChain.nativeCurrency, address: zeroAddress }
              }
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            <div>
              {leveragePosition === 'Long'
                ? collateral?.underlying.symbol
                : asset?.underlying.symbol}
            </div>
          </div>
        </Link>
        <div className="flex flex-col lg:flex-row-reverse sm:items-center lg:items-start justify-center gap-4 mb-4 px-2 md:px-0">
          {targetCurrency ? (
            <ChartContainer
              currency={targetCurrency}
              intervalList={['1H', '1D', '1W', '1M', '1Y']}
              width={isMobile ? (windowSize.width * 6) / 7 : 432}
              height={isMobile ? 158 : 386}
              className="sm:w-[480px] h-[256px] sm:h-[496px]"
            />
          ) : (
            <></>
          )}
          <LeverageForm
            borrowCurrency={asset?.underlying}
            setBorrowCurrency={setBorrowCurrency}
            availableBorrowCurrencies={availableDebtCurrencies}
            interest={maxInterest}
            borrowApy={apy}
            borrowLTV={
              collateral &&
              asset &&
              prices[asset.underlying.address] &&
              prices[collateral?.underlying.address]
                ? calculateLtv(
                    asset.underlying,
                    prices[asset.underlying.address],
                    debtAmountWithoutCouponFee + interest,
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
            availableCollaterals={availableCollaterals}
            collateralValue={collateralValue}
            collateralAmount={collateralAmount}
            setCollateralValue={setCollateralValue}
            borrowValue={formatUnits(
              debtAmountWithoutCouponFee + interest,
              asset?.underlying.decimals ?? 18,
              asset ? prices[asset.underlying.address] : undefined,
            )}
            epochs={epochs}
            setEpochs={setEpochs}
            multiple={multiple}
            setMultiple={setMultiple}
            maxAvailableMultiple={
              collateral && collateral.liquidationTargetLtv > 0n
                ? Math.floor(
                    1 /
                      (1 -
                        Number(collateral.liquidationTargetLtv) /
                          Number(collateral.ltvPrecision)),
                  ) - 0.02
                : 0
            }
            balances={balances}
            prices={prices}
            actionButtonProps={{
              disabled:
                !interestsByEpochsBorrowed ||
                interestsByEpochsBorrowed.length === 0 ||
                inputCollateralAmount === 0n ||
                inputCollateralAmount > collateralUserBalance ||
                debtAmountWithoutCouponFee > available - maxInterest ||
                debtAmountWithoutCouponFee >
                  maxLoanableAmountExcludingCouponFee - maxInterest ||
                isDeptSizeLessThanMinDebtSize,
              onClick: async () => {
                if (!collateral || !asset || !pathId) {
                  return
                }
                const { data: swapData } = await fetchCallDataByOdos({
                  pathId,
                  userAddress:
                    CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS]
                      .BorrowController,
                })
                const { timestamp } = await publicClient.getBlock()
                const hash = await leverage(
                  collateral,
                  collateralAmount,
                  inputCollateralAmount,
                  asset,
                  debtAmountWithoutCouponFee,
                  allEpochs[epochs].id,
                  min(interest, maxInterest),
                  swapData,
                  SLIPPAGE_LIMIT_PERCENT,
                  asset
                    ? buildPendingPosition(
                        asset.substitutes[0],
                        asset.underlying,
                        collateral,
                        min(interest, maxInterest),
                        debtAmountWithoutCouponFee,
                        collateralAmount,
                        endTimestamp,
                        Number(timestamp),
                        true,
                        collateralAmount - inputCollateralAmount,
                        prices[collateral.underlying.address],
                        prices[asset.underlying.address],
                      )
                    : undefined,
                )
                if (hash) {
                  await router.replace('/?mode=borrow')
                }
              },
              text:
                inputCollateralAmount === 0n
                  ? 'Enter collateral amount'
                  : inputCollateralAmount > collateralUserBalance
                  ? `Insufficient ${collateral?.underlying.symbol} balance`
                  : debtAmountWithoutCouponFee > available - maxInterest
                  ? 'Not enough coupons for sale'
                  : debtAmountWithoutCouponFee >
                    maxLoanableAmountExcludingCouponFee - maxInterest
                  ? 'Not enough collateral'
                  : isDeptSizeLessThanMinDebtSize
                  ? `Remaining debt must be ≥ ${minDebtSizeInEth.toFixed(
                      3,
                      BigNumber.ROUND_CEIL,
                    )} ETH`
                  : 'Leverage',
            }}
          >
            <HelperModalButton
              onClick={() => {
                setShowHelperModal(true)
              }}
              text={`Get more ${collateral?.underlying.symbol}`}
              bounce={collateralAmount > collateralUserBalance}
            />
            {showHelperModal ? children : null}
          </LeverageForm>
        </div>
      </div>
    </main>
  )
}

export default LeverageFormContainer
