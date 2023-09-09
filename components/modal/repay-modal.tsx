import React, { useMemo, useState } from 'react'
import { useAccount, useFeeData, useNetwork } from 'wagmi'
import { isAddressEqual, parseUnits } from 'viem'
import { useQuery } from '@tanstack/react-query'

import { LoanPosition } from '../../model/loan-position'
import CurrencyAmountInput from '../currency-amount-input'
import { useCurrencyContext } from '../../contexts/currency-context'
import { dollarValue, formatUnits } from '../../utils/numbers'
import { Arrow } from '../svg/arrow'
import { fetchMarkets } from '../../api/market'
import { calculateCouponsToRepay } from '../../model/market'
import { max, min } from '../../utils/bigint'
import { useBorrowContext } from '../../contexts/borrow-context'
import { fetchAmountOutByOdos, fetchCallDataByOdos } from '../../api/odos'

import Modal from './modal'

const RepayModal = ({
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
    data: { repayAmount, maximumPayableCollateralAmount, pathId },
  } = useQuery(
    [
      'calculate-repay-amount',
      position.id.toString(),
      amount.toString(),
      isUseCollateral,
    ],
    async () => {
      if (
        !isUseCollateral ||
        isAddressEqual(
          position.collateral.underlying.address,
          position.underlying.address,
        )
      ) {
        return {
          repayAmount: amount,
          maximumPayableCollateralAmount: position.collateralAmount,
          pathId: undefined,
        }
      }
      if (feeData?.gasPrice && userAddress && connectedChain) {
        const { amountOut: maximumPayableCollateralAmount } =
          await fetchAmountOutByOdos({
            chainId: connectedChain.id,
            amountIn: position.amount.toString(),
            tokenIn: position.underlying.address,
            tokenOut: position.collateral.underlying.address,
            slippageLimitPercent: 1,
            userAddress,
            gasPrice: Number(feeData.gasPrice),
          })
        const { amountOut: repayAmount, pathId } = await fetchAmountOutByOdos({
          chainId: connectedChain.id,
          amountIn: amount.toString(),
          tokenIn: position.collateral.underlying.address,
          tokenOut: position.underlying.address,
          slippageLimitPercent: 1,
          userAddress,
          gasPrice: Number(feeData.gasPrice),
        })
        return {
          repayAmount,
          maximumPayableCollateralAmount,
          pathId,
        }
      }
      return {
        repayAmount: 0n,
        maximumPayableCollateralAmount: 0n,
        pathId: undefined,
      }
    },
    {
      refetchInterval: 5000,
      keepPreviousData: true,
      initialData: {
        repayAmount: 0n,
        maximumPayableCollateralAmount: 0n,
        pathId: undefined,
      },
    },
  )

  const { data } = useQuery(
    [
      'coupon-refundable-amount-to-repay',
      position.id.toString(),
      repayAmount.toString(),
    ],
    async () => {
      const market = (await fetchMarkets())
        .filter((market) =>
          isAddressEqual(
            market.quoteToken.address,
            position.substitute.address,
          ),
        )
        .filter((market) => market.epoch === position.toEpoch.id)[0]
      return calculateCouponsToRepay(position.substitute, market, repayAmount)
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
        ),
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
    <Modal show onClose={onClose}>
      <h1 className="font-bold text-sm sm:text-xl mb-4 sm:mb-6">Repay</h1>
      <div className="flex mb-6 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-500">
        <button
          className="flex-1 py-2 rounded border-gray-100 dark:border-gray-800 disabled:bg-white dark:disabled:bg-gray-800 disabled:border-green-500 dark:disabled:border-green-500 disabled:text-green-500 border-[1.5px]"
          disabled={!isUseCollateral}
          onClick={() => setIsUseCollateral(false)}
        >
          Repay with <br className="flex sm:hidden" /> Wallet Balance
        </button>
        <button
          className="flex-1 py-2 rounded border-gray-100 dark:border-gray-800 disabled:bg-white dark:disabled:bg-gray-800 disabled:border-green-500 dark:disabled:border-green-500 disabled:text-green-500 border-[1.5px]"
          disabled={isUseCollateral}
          onClick={() => setIsUseCollateral(true)}
        >
          Repay with <br className="flex sm:hidden" /> Collateral
        </button>
      </div>
      <div className="mb-4 font-bold">How much would you like to repay?</div>
      <div className="mb-6">
        {isUseCollateral ? (
          <CurrencyAmountInput
            currency={position.collateral.underlying}
            value={value}
            onValueChange={setValue}
            price={prices[position.collateral.underlying.address]}
            balance={min(
              position.collateralAmount,
              isAddressEqual(
                position.underlying.address,
                position.collateral.underlying.address,
              )
                ? position.amount
                : 2n ** 256n - 1n,
              maximumPayableCollateralAmount,
            )}
          />
        ) : (
          <CurrencyAmountInput
            currency={position.underlying}
            value={value}
            onValueChange={setValue}
            price={prices[position.underlying.address]}
            balance={min(
              position.amount,
              available,
              balances[position.underlying.address],
            )}
          />
        )}
      </div>
      <div className="font-bold mb-3">Transaction Overview</div>
      <div className="flex flex-col gap-2 text-gray-500 text-sm mb-8">
        <div className="flex gap-3 justify-between sm:justify-start">
          <div className="text-gray-500">Remaining Debt</div>
          <div>
            {formatUnits(
              position.amount,
              position.underlying.decimals,
              prices[position.underlying.address],
            )}{' '}
            {position.underlying.symbol}
          </div>
        </div>
        <div className="flex gap-3 justify-between sm:justify-start">
          <div className="text-gray-500">LTV</div>
          <div className="flex items-center gap-1">
            <span className="text-green-500">{currentLtv.toFixed(2)}%</span>
            {value ? (
              <>
                <Arrow />
                <span className="text-green-500">{expectedLtv}%</span>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <button
        disabled={
          repayAmount === 0n ||
          repayAmount > available ||
          repayAmount > position.amount ||
          (!isUseCollateral &&
            repayAmount > balances[position.underlying.address])
        }
        className="font-bold text-base sm:text-xl bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
        onClick={async () => {
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
            )
          } else if (isUseCollateral && !pathId) {
            //TODO: support debt asset and collateral asset are the same
            console.error('not supported same asset')
          } else if (!isUseCollateral) {
            await repay(position, amount, refund)
          }
          setValue('')
          onClose()
        }}
      >
        {repayAmount === 0n
          ? 'Enter amount to repay'
          : repayAmount > available
          ? 'Not enough coupons for sale'
          : repayAmount > position.amount
          ? 'Repay amount exceeds debt'
          : !isUseCollateral &&
            repayAmount > balances[position.underlying.address]
          ? `Insufficient ${position.underlying.symbol} balance`
          : isUseCollateral
          ? 'Repay with Collateral'
          : 'Repay'}
      </button>
    </Modal>
  )
}

export default RepayModal
