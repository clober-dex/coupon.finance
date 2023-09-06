import React, { useMemo, useState } from 'react'
import { parseUnits } from 'viem'

import { LoanPosition } from '../../model/loan-position'
import CurrencyAmountInput from '../currency-amount-input'
import { useCurrencyContext } from '../../contexts/currency-context'
import { LIQUIDATION_TARGET_LTV_PRECISION, max } from '../../utils/bigint'
import { dollarValue } from '../../utils/numbers'
import { useBorrowContext } from '../../contexts/borrow-context'

import Modal from './modal'

const EditCollateralModal = ({
  position,
  onClose,
}: {
  position: LoanPosition
  onClose: () => void
}) => {
  const { addCollateral, removeCollateral } = useBorrowContext()
  const { prices, balances } = useCurrencyContext()
  const [value, setValue] = useState('')
  const [isWithdrawCollateral, setIsWithdrawCollateral] = useState(false)

  const amount = useMemo(
    () =>
      position
        ? parseUnits(value, position.collateral.underlying.decimals)
        : 0n,
    [position, value],
  )

  const minCollateralAmount = useMemo(() => {
    const collateralPrice =
      prices[position.collateral.underlying.address]?.value ?? 0n
    const collateralComplement =
      10n ** BigInt(18 - position.collateral.underlying.decimals)
    const loanPrice = prices[position.underlying.address]?.value ?? 0n
    const loanComplement = 10n ** BigInt(18 - position.underlying.decimals)

    return loanPrice && collateralPrice
      ? (position.amount *
          LIQUIDATION_TARGET_LTV_PRECISION *
          loanPrice *
          loanComplement) /
          (collateralPrice *
            collateralComplement *
            BigInt(position.collateral.liquidationTargetLtv))
      : 0n
  }, [position, prices])

  const availableCollateralAmount = useMemo(
    () =>
      isWithdrawCollateral
        ? max(position.collateralAmount - minCollateralAmount, 0n)
        : balances[position.collateral.underlying.address],
    [balances, isWithdrawCollateral, minCollateralAmount, position],
  )

  const ltv = useMemo(() => {
    const collateralDollarValue = Math.max(
      dollarValue(
        position.collateralAmount + (isWithdrawCollateral ? -amount : amount),
        position.collateral.underlying.decimals,
        prices[position.collateral.underlying.address],
      ).toNumber(),
      0,
    )
    const loanDollarValue = dollarValue(
      position.amount,
      position.underlying.decimals,
      prices[position.underlying.address],
    )
    return loanDollarValue.times(100).div(collateralDollarValue).toNumber()
  }, [amount, isWithdrawCollateral, position, prices])

  return (
    <Modal show onClose={onClose}>
      <h1 className="font-bold text-xl mb-6">Add or withdraw collateral</h1>
      <div className="flex mb-6 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-500">
        <button
          className="flex-1 py-2 rounded border-gray-100 dark:border-gray-800 disabled:border-green-500 dark:disabled:border-green-500 disabled:text-green-500 border-[1.5px]"
          disabled={!isWithdrawCollateral}
          onClick={() => setIsWithdrawCollateral(false)}
        >
          Add Collateral
        </button>
        <button
          className="flex-1 py-2 rounded border-gray-100 dark:border-gray-800 disabled:border-green-500 dark:disabled:border-green-500 disabled:text-green-500 border-[1.5px]"
          disabled={isWithdrawCollateral}
          onClick={() => setIsWithdrawCollateral(true)}
        >
          Withdraw Collateral
        </button>
      </div>
      <div className="mb-4">
        <CurrencyAmountInput
          currency={position.collateral.underlying}
          value={value}
          onValueChange={setValue}
          price={prices[position.collateral.underlying.address]}
          balance={availableCollateralAmount}
        />
      </div>
      <div className="flex text-sm gap-3 mb-8">
        <span className="text-gray-500">LTV</span>
        {ltv.toFixed(2)}%
      </div>
      <button
        disabled={amount === 0n || amount > availableCollateralAmount}
        className="font-bold text-base sm:text-xl bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
        onClick={async () => {
          isWithdrawCollateral
            ? await removeCollateral(position, amount)
            : await addCollateral(position, amount)
          setValue('')
          onClose()
        }}
      >
        {amount === 0n
          ? 'Enter collateral amount'
          : !isWithdrawCollateral && amount > availableCollateralAmount
          ? `Insufficient ${position.collateral.underlying.symbol} balance`
          : isWithdrawCollateral && amount > position.collateralAmount
          ? 'Not enough collateral'
          : 'Confirm'}
      </button>
    </Modal>
  )
}

export default EditCollateralModal
