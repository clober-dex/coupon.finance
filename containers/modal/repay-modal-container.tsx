import React, { useMemo, useState } from 'react'
import { useAccount, useFeeData, useNetwork, useQuery } from 'wagmi'
import { isAddressEqual, parseUnits } from 'viem'

import { LoanPosition } from '../../model/loan-position'
import { useCurrencyContext } from '../../contexts/currency-context'
import { dollarValue } from '../../utils/numbers'
import { fetchMarkets } from '../../apis/market'
import { calculateCouponsToRepay } from '../../model/market'
import { max, min } from '../../utils/bigint'
import { useBorrowContext } from '../../contexts/borrow-context'
import { fetchAmountOutByOdos } from '../../apis/odos'
import RepayModal from '../../components/modal/repay-modal'

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
    ['calculate-repay-amount', position, amount, isUseCollateral],
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
    ['coupon-refundable-amount-to-repay', position, repayAmount],
    async () => {
      const markets = (await fetchMarkets())
        .filter((market) =>
          isAddressEqual(
            market.quoteToken.address,
            position.substitute.address,
          ),
        )
        .filter((market) => market.epoch <= position.toEpoch.id)
      return calculateCouponsToRepay(position.substitute, markets, repayAmount)
    },
    {
      keepPreviousData: true,
    },
  )

  const refund = useMemo(() => data?.refund ?? 0n, [data?.refund])
  const available = useMemo(() => data?.available ?? 0n, [data?.available])

  const currentLtv = useMemo(
    () =>
      dollarValue(
        position.amount,
        position.underlying.decimals,
        prices[position.underlying.address],
      )
        .times(100)
        .div(
          dollarValue(
            position.collateralAmount,
            position.collateral.underlying.decimals,
            prices[position.collateral.underlying.address],
          ),
        )
        .toFixed(2),
    [position, prices],
  )

  const expectedLtv = useMemo(() => {
    const debtAmount = max(position.amount - repayAmount, 0n)
    const debtValue = dollarValue(
      debtAmount,
      position.underlying.decimals,
      prices[position.underlying.address],
    )
    const collateralAmount = max(
      position.collateralAmount - (isUseCollateral ? amount : 0n),
      0n,
    )
    const collateralValue = dollarValue(
      collateralAmount,
      position.collateral.underlying.decimals,
      prices[position.collateral.underlying.address],
    )
    return debtAmount > 0n && collateralAmount === 0n
      ? 'Infinity'
      : collateralAmount === 0n
      ? '0'
      : debtValue.times(100).div(collateralValue).toFixed(2)
  }, [repayAmount, isUseCollateral, amount, position, prices])

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
      available={available}
      balances={balances}
      showSlippageSelect={showSlippageSelect}
      slippage={slippage}
      setSlippage={setSlippage}
      currentLtv={currentLtv}
      expectedLtv={expectedLtv}
      userAddress={userAddress}
      pathId={pathId}
      repayWithCollateral={repayWithCollateral}
      repay={repay}
      amount={amount}
      refund={refund}
      minBalance={min(
        position.amount,
        available,
        balances[position.underlying.address],
      )}
    />
  )
}

export default RepayModalContainer
