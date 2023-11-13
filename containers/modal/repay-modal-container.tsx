import React, { useCallback, useMemo, useState } from 'react'
import { useAccount, useFeeData, useQuery } from 'wagmi'
import { isAddressEqual, parseUnits, zeroAddress } from 'viem'
import BigNumber from 'bignumber.js'

import { LoanPosition } from '../../model/loan-position'
import { useCurrencyContext } from '../../contexts/currency-context'
import { fetchMarkets } from '../../apis/market'
import { calculateCouponsToRepay } from '../../model/market'
import { max, min } from '../../utils/bigint'
import { useBorrowContext } from '../../contexts/borrow-context'
import { fetchAmountOutByOdos, fetchCallDataByOdos } from '../../apis/odos'
import RepayModal from '../../components/modal/repay-modal'
import { calculateLtv } from '../../utils/ltv'
import { MIN_DEBT_SIZE_IN_ETH } from '../../constants/debt'
import { CHAIN_IDS } from '../../constants/chain'
import { ethValue } from '../../utils/currency'
import { useChainContext } from '../../contexts/chain-context'

const RepayModalContainer = ({
  position,
  onClose,
}: {
  position: LoanPosition
  onClose: () => void
}) => {
  const { data: feeData } = useFeeData()
  const { address: userAddress } = useAccount()
  const { selectedChain } = useChainContext()
  const { repay, repayWithCollateral } = useBorrowContext()
  const { prices, balances } = useCurrencyContext()

  const [isUseCollateral, _setIsUseCollateral] = useState(false)
  const [value, setValue] = useState('')
  const [slippage, setSlippage] = useState('1')
  const [showSlippageSelect, setShowSlippageSelect] = useState(false)

  const setIsUseCollateral = useCallback((value: boolean) => {
    _setIsUseCollateral(value)
    setValue('')
  }, [])

  const amount = useMemo(
    () =>
      parseUnits(
        value,
        isUseCollateral
          ? position.collateral.underlying.decimals
          : position.underlying.decimals,
      ),
    [isUseCollateral, position, value],
  )

  const {
    data: { repayAmount, pathId },
  } = useQuery(
    ['repay-with-collateral-simulate', position, amount, isUseCollateral],
    async () => {
      if (!isUseCollateral) {
        return {
          repayAmount: amount,
          pathId: undefined,
        }
      }
      if (feeData?.gasPrice && userAddress && selectedChain) {
        const { amountOut: repayAmount, pathId } = await fetchAmountOutByOdos({
          chainId: selectedChain.id,
          amountIn: amount.toString(),
          tokenIn: position.collateral.underlying.address,
          tokenOut: position.underlying.address,
          slippageLimitPercent: Number(slippage),
          userAddress,
          gasPrice: Number(feeData.gasPrice),
        })
        return {
          repayAmount,
          pathId,
        }
      }
      return {
        repayAmount: 0n,
        pathId: undefined,
      }
    },
    {
      refetchInterval: 5 * 1000,
      keepPreviousData: true,
      initialData: {
        repayAmount: 0n,
        pathId: undefined,
      },
    },
  )

  const { data } = useQuery(
    ['repay-simulate', position, repayAmount, selectedChain],
    async () => {
      if (!selectedChain) {
        return {
          maxRefund: 0n,
          refund: 0n,
        }
      }
      const markets = (await fetchMarkets(selectedChain.id))
        .filter((market) =>
          isAddressEqual(
            market.quoteToken.address,
            position.substitute.address,
          ),
        )
        .filter((market) => market.epoch <= position.toEpoch.id)
      return calculateCouponsToRepay(
        position.substitute,
        markets,
        position.amount,
        repayAmount,
      )
    },
    {
      keepPreviousData: true,
    },
  )

  const [refund, maxRefund] = useMemo(
    () => (data ? [data.refund, data.maxRefund] : [0n, 0n]),
    [data],
  )
  const repayAll = useMemo(
    () => amount + maxRefund >= position.amount,
    [amount, maxRefund, position.amount],
  )

  const minDebtSizeInEth = MIN_DEBT_SIZE_IN_ETH[selectedChain.id as CHAIN_IDS]
  const expectedDebtSizeInEth = ethValue(
    selectedChain,
    prices[zeroAddress],
    position.underlying,
    max(position.amount - repayAmount - refund, 0n),
    prices[position.underlying.address],
  )
  const isExpectedDebtSizeLessThanMinDebtSize =
    expectedDebtSizeInEth.lt(minDebtSizeInEth) && expectedDebtSizeInEth.gt(0)

  return (
    <RepayModal
      debtCurrency={position.underlying}
      collateral={position.collateral}
      collateralAmount={position.collateralAmount}
      onClose={onClose}
      setShowSlippageSelect={setShowSlippageSelect}
      isUseCollateral={isUseCollateral}
      setIsUseCollateral={setIsUseCollateral}
      value={value}
      setValue={setValue}
      repayAmount={repayAmount}
      refundAmountAfterSwap={
        isUseCollateral ? repayAmount - position.amount : 0n
      }
      maxRepayableAmount={min(
        position.amount - maxRefund,
        balances[position.underlying.address],
      )}
      showSlippageSelect={showSlippageSelect}
      slippage={slippage}
      setSlippage={setSlippage}
      currentLtv={
        prices[position.underlying.address] &&
        prices[position.collateral.underlying.address]
          ? calculateLtv(
              position.underlying,
              prices[position.underlying.address],
              position.amount,
              position.collateral,
              prices[position.collateral.underlying.address],
              position.collateralAmount,
            )
          : 0
      }
      expectedLtv={
        prices[position.underlying.address] &&
        prices[position.collateral.underlying.address]
          ? calculateLtv(
              position.underlying,
              prices[position.underlying.address],
              max(position.amount - repayAmount - refund, 0n),
              position.collateral,
              prices[position.collateral.underlying.address],
              position.collateralAmount,
            )
          : 0
      }
      remainingDebt={position.amount - maxRefund}
      actionButtonProps={{
        disabled:
          repayAmount === 0n ||
          (!isUseCollateral &&
            repayAmount > balances[position.underlying.address]) ||
          (!isUseCollateral && repayAmount > position.amount - maxRefund) ||
          (isUseCollateral && amount > position.collateralAmount) ||
          isExpectedDebtSizeLessThanMinDebtSize,
        onClick: async () => {
          if (!userAddress) {
            return
          }
          if (isUseCollateral && pathId) {
            const swapData = await fetchCallDataByOdos({
              pathId,
              userAddress,
            })
            await repayWithCollateral(
              position,
              amount,
              repayAmount,
              refund,
              swapData,
              repayAmount - position.amount,
            )
          } else if (!isUseCollateral) {
            await repay(position, amount, repayAll ? maxRefund : refund)
          }
          setValue('')
          onClose()
        },
        text:
          repayAmount === 0n
            ? 'Enter amount to repay'
            : !isUseCollateral &&
              repayAmount > balances[position.underlying.address]
            ? `Insufficient ${position.underlying.symbol} balance`
            : !isUseCollateral && repayAmount > position.amount - maxRefund
            ? `Cannot repay more than remaining debt`
            : isUseCollateral && amount > position.collateralAmount
            ? `Cannot use more than collateral amount`
            : isExpectedDebtSizeLessThanMinDebtSize
            ? `Remaining debt must be ≥ ${minDebtSizeInEth.toFixed(
                3,
                BigNumber.ROUND_CEIL,
              )} ETH`
            : isUseCollateral
            ? 'Repay with Collateral'
            : 'Repay',
      }}
      debtAssetPrice={prices[position.underlying.address]}
      collateralPrice={prices[position.collateral.underlying.address]}
    />
  )
}

export default RepayModalContainer
