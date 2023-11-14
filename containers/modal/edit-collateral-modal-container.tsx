import React, { useMemo, useState } from 'react'
import { parseUnits } from 'viem'

import { LoanPosition } from '../../model/loan-position'
import { useCurrencyContext } from '../../contexts/currency-context'
import { max } from '../../utils/bigint'
import { useBorrowContext } from '../../contexts/borrow-context'
import EditCollateralModal from '../../components/modal/edit-collateral-modal'
import { calculateLtv, calculateMinCollateralAmount } from '../../utils/ltv'

const EditCollateralModalContainer = ({
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

  const [amount, minCollateralAmount] = useMemo(
    () => [
      parseUnits(value, position.collateral.underlying.decimals),
      prices[position.underlying.address] &&
      prices[position.collateral.underlying.address]
        ? calculateMinCollateralAmount(
            position.underlying,
            prices[position.underlying.address],
            position.collateral,
            prices[position.collateral.underlying.address],
            position.amount,
          )
        : 0n,
    ],
    [position.amount, position.collateral, position.underlying, prices, value],
  )

  const availableCollateralAmount = useMemo(
    () =>
      isWithdrawCollateral
        ? max(position.collateralAmount - minCollateralAmount, 0n)
        : balances[position.collateral.underlying.address] ?? 0n,
    [
      balances,
      isWithdrawCollateral,
      minCollateralAmount,
      position.collateral.underlying.address,
      position.collateralAmount,
    ],
  )

  return (
    <EditCollateralModal
      collateral={position.collateral}
      onClose={onClose}
      value={value}
      setValue={setValue}
      isWithdrawCollateral={isWithdrawCollateral}
      setIsWithdrawCollateral={setIsWithdrawCollateral}
      availableCollateralAmount={
        isWithdrawCollateral
          ? max(position.collateralAmount - minCollateralAmount, 0n)
          : balances[position.collateral.underlying.address] ?? 0n
      }
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
              position.amount,
              position.collateral,
              prices[position.collateral.underlying.address],
              position.collateralAmount +
                (isWithdrawCollateral ? -amount : amount),
            )
          : 0
      }
      actionButtonProps={{
        disabled: amount === 0n || amount > availableCollateralAmount,
        onClick: async () => {
          isWithdrawCollateral
            ? await removeCollateral(position, amount)
            : await addCollateral(position, amount)
          setValue('')
          onClose()
        },
        text:
          amount === 0n
            ? 'Enter collateral amount'
            : !isWithdrawCollateral && amount > availableCollateralAmount
            ? `Insufficient ${position.collateral.underlying.symbol} balance`
            : isWithdrawCollateral && amount > position.collateralAmount
            ? 'Not enough collateral'
            : 'Edit Collateral',
      }}
      collateralPrice={prices[position.collateral.underlying.address]}
    />
  )
}

export default EditCollateralModalContainer
