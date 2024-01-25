import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { getAddress, isAddressEqual, zeroAddress } from 'viem'
import { useAccount, usePublicClient, useQuery } from 'wagmi'
import BigNumber from 'bignumber.js'

import { useCurrencyContext } from '../../contexts/currency-context'
import { fetchBorrowApyByEpochsBorrowed } from '../../apis/market'
import { useBorrowContext } from '../../contexts/borrow-context'
import { Collateral, generateDummyCollateral } from '../../model/collateral'
import {
  calculateLiquidationPrice,
  calculateLtv,
  calculateMaxLoanableAmount,
} from '../../utils/ltv'
import { max, min } from '../../utils/bigint'
import { BorrowForm } from '../../components/form/borrow-form'
import { useChainContext } from '../../contexts/chain-context'
import { MIN_DEBT_SIZE_IN_ETH } from '../../constants/debt'
import { CHAIN_IDS } from '../../constants/chain'
import { ethValue } from '../../utils/currency'
import { buildPendingPosition } from '../../model/loan-position'
import { parseUnits } from '../../utils/numbers'
import { Currency } from '../../model/currency'
import { HelperModalButton } from '../../components/button/helper-modal-button'

const BorrowFormContainer = ({
  showHelperModal,
  setShowHelperModal,
  setHelperModalOutputCurrency,
  defaultBorrowCurrency,
  defaultCollateralCurrency,
  children,
}: {
  showHelperModal: boolean
  setShowHelperModal: (value: boolean) => void
  setHelperModalOutputCurrency: (value: Currency | undefined) => void
  defaultBorrowCurrency?: Currency
  defaultCollateralCurrency?: Currency
} & React.PropsWithChildren) => {
  const { selectedChain } = useChainContext()
  const publicClient = usePublicClient()
  const { address: userAddress } = useAccount()
  const { balances, prices, assets, epochs: allEpochs } = useCurrencyContext()
  const { borrow } = useBorrowContext()

  const [epochs, setEpochs] = useState(0)
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

  useEffect(() => {
    if (collateral) {
      setHelperModalOutputCurrency(collateral.underlying)
    }
  }, [collateral, setHelperModalOutputCurrency])

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
    [asset, collateral, collateralAmount, prices],
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
    borrowAmount + interest,
    prices[asset?.underlying?.address ?? zeroAddress],
    selectedChain.nativeCurrency.decimals,
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
      isCollateralFixed={isCollateralFixed}
      borrowCurrency={asset?.underlying}
      setBorrowCurrency={setBorrowCurrency}
      availableBorrowCurrencies={
        isCollateralFixed && collateral
          ? assets
              .filter((asset) =>
                asset.collaterals
                  .map((c) => getAddress(c.underlying.address))
                  .includes(getAddress(collateral.underlying.address)),
              )
              .map((asset) => asset.underlying)
          : asset
          ? [asset.underlying]
          : []
      }
      availableCollaterals={
        isCollateralFixed && collateral
          ? [collateral]
          : asset
          ? asset.collaterals
          : []
      }
      maxBorrowAmount={max(
        min(maxLoanableAmountExcludingCouponFee - maxInterest, available),
        0n,
      )}
      interest={interest}
      borrowingFeePercentage={(Number(interest) / Number(borrowAmount)) * 100}
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
      liquidationPrice={
        collateral &&
        asset &&
        prices[asset.underlying.address] &&
        prices[collateral.underlying.address]
          ? calculateLiquidationPrice(
              asset.underlying,
              prices[asset.underlying.address],
              collateral,
              prices[collateral.underlying.address],
              borrowAmount,
              collateralAmount,
            )
          : 0
      }
      actionButtonProps={{
        disabled:
          collateralAmount === 0n ||
          borrowAmount === 0n ||
          collateralAmount > collateralUserBalance ||
          borrowAmount > available - maxInterest ||
          borrowAmount > maxLoanableAmountExcludingCouponFee - maxInterest ||
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
            allEpochs[epochs].id,
            min(interest, maxInterest),
            asset && userAddress
              ? buildPendingPosition(
                  userAddress,
                  asset.substitutes[0],
                  asset.underlying,
                  collateral,
                  min(interest, maxInterest),
                  borrowAmount,
                  collateralAmount,
                  endTimestamp,
                  Number(timestamp),
                  false,
                  0n,
                  prices[collateral.underlying.address],
                  prices[asset.underlying.address],
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
          collateralAmount === 0n
            ? 'Enter collateral amount'
            : borrowAmount === 0n
            ? 'Enter loan amount'
            : collateralAmount > collateralUserBalance
            ? `Insufficient ${collateral?.underlying.symbol} balance`
            : borrowAmount > available - maxInterest
            ? 'Not enough coupons for sale'
            : borrowAmount > maxLoanableAmountExcludingCouponFee - maxInterest
            ? 'Not enough collateral'
            : isDeptSizeLessThanMinDebtSize
            ? `Remaining debt must be ≥ ${minDebtSizeInEth.toFixed(
                3,
                BigNumber.ROUND_CEIL,
              )} ETH`
            : 'Borrow',
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
    </BorrowForm>
  )
}

export default BorrowFormContainer
