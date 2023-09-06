import React, { useMemo, useState } from 'react'
import { useAccount, useFeeData, useNetwork, useQuery } from 'wagmi'
import { isAddressEqual, parseUnits } from 'viem'

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
      position
        ? parseUnits(
            value,
            isUseCollateral
              ? position.collateral.underlying.decimals
              : position.underlying.decimals,
          )
        : 0n,
    [isUseCollateral, position, value],
  )

  const { data: maxAmountIn } = useQuery(
    ['fetch-max-amount-in-to-repay-with-collateral', position],
    async () => {
      if (
        isAddressEqual(
          position.collateral.underlying.address,
          position.underlying.address,
        )
      ) {
        return position.amount
      }
      if (!feeData?.gasPrice || !userAddress || !connectedChain) {
        return 0n
      }
      const { amountOut } = await fetchAmountOutByOdos({
        chainId: connectedChain.id,
        amountIn: position.amount.toString(),
        tokenIn: position.underlying.address,
        tokenOut: position.collateral.underlying.address,
        slippageLimitPercent: 1,
        userAddress,
        gasPrice: Number(feeData.gasPrice),
      })
      return amountOut
    },
    {
      enabled: isUseCollateral,
      initialData: 0n,
    },
  )

  const {
    data: { amountOut: boughtDebtAmount, pathId },
  } = useQuery(
    ['fetch-amount-out-to-repay-with-collateral', position, amount],
    async () => {
      if (
        isAddressEqual(
          position.collateral.underlying.address,
          position.underlying.address,
        )
      ) {
        return { amountOut: amount, pathId: '' }
      }
      if (
        !feeData?.gasPrice ||
        !userAddress ||
        !connectedChain ||
        amount === 0n
      ) {
        return { amountOut: 0n, pathId: '' }
      }
      return fetchAmountOutByOdos({
        chainId: connectedChain.id,
        amountIn: amount.toString(),
        tokenIn: position.collateral.underlying.address,
        tokenOut: position.underlying.address,
        slippageLimitPercent: 1,
        userAddress,
        gasPrice: Number(feeData.gasPrice),
      })
    },
    {
      enabled: isUseCollateral,
      initialData: { amountOut: 0n, pathId: '' },
    },
  )

  const { data } = useQuery(
    ['coupon-refundable-amount-to-repay', position, amount, boughtDebtAmount],
    async () => {
      const market = (await fetchMarkets())
        .filter((market) =>
          isAddressEqual(
            market.quoteToken.address,
            position.substitute.address,
          ),
        )
        .filter((market) => market.epoch === position.toEpoch.id)[0]
      return calculateCouponsToRepay(
        position.substitute,
        market,
        isUseCollateral ? boughtDebtAmount : amount,
      )
    },
    {
      keepPreviousData: true,
    },
  )

  const refund = useMemo(() => data?.refund ?? 0n, [data])
  const available = useMemo(() => data?.available ?? 0n, [data?.available])

  const buttonDisable = useMemo(() => {
    if (isUseCollateral) {
      return (
        amount === 0n ||
        boughtDebtAmount === 0n ||
        boughtDebtAmount > available ||
        boughtDebtAmount > position.amount
      )
    } else {
      return (
        amount === 0n ||
        amount > available ||
        amount > position.amount ||
        amount > balances[position.underlying.address]
      )
    }
  }, [boughtDebtAmount, isUseCollateral, amount, available, balances, position])

  const buttonText = useMemo(() => {
    if (isUseCollateral) {
      return amount === 0n
        ? 'Enter amount to repay with collateral'
        : boughtDebtAmount === 0n
        ? 'Cannot repay with collateral'
        : boughtDebtAmount > available
        ? 'Not enough coupons for sale'
        : boughtDebtAmount > position.amount
        ? 'Repay amount exceeds debt'
        : 'Repay with Collateral'
    } else {
      return amount === 0n
        ? 'Enter amount to repay'
        : amount > available
        ? 'Not enough coupons for sale'
        : amount > position.amount
        ? 'Repay amount exceeds debt'
        : amount > balances[position.underlying.address]
        ? `Insufficient ${position.underlying.symbol} balance`
        : 'Repay'
    }
  }, [isUseCollateral, amount, boughtDebtAmount, available, position, balances])

  const ltv = useMemo(() => {
    const debtAmount = max(
      position.amount - (isUseCollateral ? boughtDebtAmount : amount),
      0n,
    )
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
  }, [boughtDebtAmount, isUseCollateral, amount, position, prices])

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
            balance={min(position.collateralAmount, available, maxAmountIn)}
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
            <span className="text-green-500">{position.ltv.toFixed(2)}%</span>
            {value ? (
              <>
                <Arrow />
                <span className="text-green-500">{ltv}%</span>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <button
        disabled={buttonDisable}
        className="font-bold text-base sm:text-xl bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
        onClick={async () => {
          if (!userAddress) {
            return
          }
          if (isUseCollateral) {
            const swapData = await fetchCallDataByOdos({
              pathId,
              userAddress,
            })
            await repayWithCollateral(
              position,
              amount,
              boughtDebtAmount,
              refund,
              swapData,
            )
          } else {
            await repay(position, amount, refund)
          }
          setValue('')
          onClose()
        }}
      >
        {buttonText}
      </button>
    </Modal>
  )
}

export default RepayModal
