import React, { useMemo, useState } from 'react'
import { useAccount, useFeeData, useNetwork, useQuery } from 'wagmi'
import { isAddressEqual, parseUnits } from 'viem'

import { LoanPosition } from '../../model/loan-position'
import { useCurrencyContext } from '../../contexts/currency-context'
import { fetchMarkets } from '../../apis/market'
import { calculateCouponsToRepay } from '../../model/market'
import { max } from '../../utils/bigint'
import { useBorrowContext } from '../../contexts/borrow-context'
import { fetchAmountOutByOdos } from '../../apis/odos'
import RepayModal from '../../components/modal/repay-modal'
import { calculateLtv } from '../../utils/ltv'

const RepayModalContainer = ({
  position,
  onClose,
}: {
  position: LoanPosition
  onClose: () => void
}) => {
  const { data: feeData } = useFeeData()
  const { address: userAddress } = useAccount()
  const { chain: connectedChain } = useNetwork()
  const { repay, repayWithCollateral } = useBorrowContext()
  const { prices, balances } = useCurrencyContext()

  const [isUseCollateral, setIsUseCollateral] = useState(false)
  const [value, setValue] = useState('')
  const [slippage, setSlippage] = useState('1')
  const [showSlippageSelect, setShowSlippageSelect] = useState(false)

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
      if (feeData?.gasPrice && userAddress && connectedChain) {
        const { amountOut: repayAmount, pathId } = await fetchAmountOutByOdos({
          chainId: connectedChain.id,
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
      refetchInterval: 5000,
      keepPreviousData: true,
      initialData: {
        repayAmount: 0n,
        pathId: undefined,
      },
    },
  )

  const { data } = useQuery(
    ['repay-simulate', position, repayAmount],
    async () => {
      const markets = (await fetchMarkets())
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

  return (
    <RepayModal
      onClose={onClose}
      setShowSlippageSelect={setShowSlippageSelect}
      isUseCollateral={isUseCollateral}
      setIsUseCollateral={setIsUseCollateral}
      position={position}
      value={value}
      setValue={setValue}
      prices={prices}
      repayAmount={repayAmount}
      balances={balances}
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
      userAddress={userAddress}
      pathId={pathId}
      repayWithCollateral={repayWithCollateral}
      repay={repay}
      amount={amount}
      maxRefund={maxRefund}
      refund={refund}
    />
  )
}

export default RepayModalContainer
