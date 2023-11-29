import React, { useEffect, useMemo, useState } from 'react'
import { getAddress, isAddressEqual, zeroAddress } from 'viem'
import { useFeeData, useQuery } from 'wagmi'
import BigNumber from 'bignumber.js'

import { useCurrencyContext } from '../../contexts/currency-context'
import { fetchBorrowApyByEpochsBorrowed } from '../../apis/market'
import { generateDummyCollateral } from '../../model/collateral'
import { calculateLtv, calculateMaxLoanableAmount } from '../../utils/ltv'
import { useChainContext } from '../../contexts/chain-context'
import { MIN_DEBT_SIZE_IN_ETH } from '../../constants/debt'
import { CHAIN_IDS } from '../../constants/chain'
import { ethValue } from '../../utils/currency'
import { formatUnits, parseUnits } from '../../utils/numbers'
import { Currency } from '../../model/currency'
import { HelperModalButton } from '../../components/button/helper-modal-button'
import { LeverageForm } from '../../components/form/leverage-form'
import { fetchAmountOutByOdos } from '../../apis/odos'

const LeverageFormContainer = ({
  showHelperModal,
  setShowHelperModal,
  setHelperModalOutputCurrency,
  defaultCollateralCurrency,
  children,
}: {
  showHelperModal: boolean
  setShowHelperModal: (value: boolean) => void
  setHelperModalOutputCurrency: (value: Currency | undefined) => void
  defaultCollateralCurrency: Currency
} & React.PropsWithChildren) => {
  const { selectedChain } = useChainContext()
  const { data: feeData } = useFeeData()
  const { balances, prices, assets } = useCurrencyContext()

  const [epochs, setEpochs] = useState(0)
  const [multiple, _setMultiple] = useState(2)
  const setMultiple = (value: number) => {
    _setMultiple(value + 2)
  }
  const [collateralValue, setCollateralValue] = useState('')
  const [borrowCurrency, setBorrowCurrency] = useState<Currency | undefined>(
    undefined,
  )

  const asset = useMemo(() => {
    return borrowCurrency
      ? assets.find((asset) =>
          isAddressEqual(asset.underlying.address, borrowCurrency.address),
        )
      : undefined
  }, [assets, borrowCurrency])

  const collateral = useMemo(() => {
    const _collateral = generateDummyCollateral(defaultCollateralCurrency)
    return asset && _collateral
      ? asset.collaterals.find((collateral) =>
          isAddressEqual(
            collateral.underlying.address,
            _collateral.underlying.address,
          ),
        )
      : _collateral
  }, [asset, defaultCollateralCurrency])

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

  // ready to calculate
  const {
    data: {
      debtAmount,
      maxLoanableAmountExcludingCouponFee,
      collateralAmount,
      interestsByEpochsBorrowed,
    },
  } = useQuery(
    [
      'leverage-simulate',
      collateral?.underlying.symbol,
      inputCollateralAmount,
      multiple,
      asset?.underlying.symbol,
      selectedChain,
    ], // TODO: useDebounce
    async () => {
      if (
        !feeData?.gasPrice ||
        !collateral ||
        !asset ||
        inputCollateralAmount === 0n
      ) {
        return {
          debtAmount: 0n,
          maxLoanableAmountExcludingCouponFee: 0n,
          collateralAmount: 0n,
          interestsByEpochsBorrowed: [],
        }
      }

      const borrowedCollateralAmount =
        inputCollateralAmount * BigInt(multiple - 1)
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
      const { amountOut: debtAmount } = await fetchAmountOutByOdos({
        chainId: selectedChain.id,
        amountIn: borrowedCollateralAmount.toString(),
        tokenIn: collateral.underlying.address,
        tokenOut: asset.underlying.address,
        slippageLimitPercent: 0.5,
        gasPrice: Number(feeData.gasPrice),
      })
      const interestsByEpochsBorrowed = await fetchBorrowApyByEpochsBorrowed(
        selectedChain.id,
        asset,
        0n,
        maxLoanableAmountExcludingCouponFee,
      )
      return {
        debtAmount,
        maxLoanableAmountExcludingCouponFee,
        collateralAmount: inputCollateralAmount + borrowedCollateralAmount,
        interestsByEpochsBorrowed,
      }
    },
    {
      refetchInterval: 10 * 1000,
      refetchIntervalInBackground: true,
      initialData: {
        debtAmount: 0n,
        maxLoanableAmountExcludingCouponFee: 0n,
        collateralAmount: 0n,
        interestsByEpochsBorrowed: [],
      },
    },
  )

  const [apy, available, maxInterest] = useMemo(
    () =>
      interestsByEpochsBorrowed && interestsByEpochsBorrowed.length > 0
        ? [
            interestsByEpochsBorrowed[epochs].apy ?? 0,
            interestsByEpochsBorrowed[epochs].available ?? 0n,
            interestsByEpochsBorrowed[epochs].maxInterest ?? 0n,
          ]
        : [0, 0n, 0n],
    [epochs, interestsByEpochsBorrowed],
  )

  const minDebtSizeInEth = MIN_DEBT_SIZE_IN_ETH[selectedChain.id as CHAIN_IDS]
  const debtSizeInEth = ethValue(
    prices[zeroAddress],
    asset?.underlying,
    debtAmount,
    prices[asset?.underlying?.address ?? zeroAddress],
    selectedChain.nativeCurrency.decimals,
  )
  const isDeptSizeLessThanMinDebtSize =
    debtSizeInEth.lt(minDebtSizeInEth) && debtSizeInEth.gt(0)

  return collateral ? (
    <LeverageForm
      borrowCurrency={asset?.underlying}
      setBorrowCurrency={setBorrowCurrency}
      availableBorrowCurrencies={
        collateral
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
              debtAmount,
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
      collateralValue={collateralValue}
      setCollateralValue={setCollateralValue}
      borrowValue={formatUnits(
        debtAmount,
        asset?.underlying.decimals ?? 18,
        asset ? prices[asset.underlying.address] : undefined,
      )}
      epochs={epochs}
      setEpochs={setEpochs}
      multiple={multiple}
      setMultiple={setMultiple}
      maxAvailableMultiple={8}
      balances={balances}
      prices={prices}
      actionButtonProps={{
        disabled:
          inputCollateralAmount === 0n ||
          inputCollateralAmount > collateralUserBalance ||
          debtAmount > available ||
          debtAmount > maxLoanableAmountExcludingCouponFee + maxInterest ||
          isDeptSizeLessThanMinDebtSize,
        onClick: async () => {
          if (!collateral || !asset) {
            return
          }
        },
        text:
          inputCollateralAmount === 0n
            ? 'Enter collateral amount'
            : inputCollateralAmount > collateralUserBalance
            ? `Insufficient ${collateral?.underlying.symbol} balance`
            : debtAmount > available
            ? 'Not enough coupons for sale'
            : debtAmount > maxLoanableAmountExcludingCouponFee + maxInterest
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
  ) : (
    <></>
  )
}

export default LeverageFormContainer
