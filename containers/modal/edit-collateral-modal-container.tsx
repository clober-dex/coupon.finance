import React, { useMemo, useState } from 'react'
import { parseUnits } from 'viem'

import { LoanPosition } from '../../model/loan-position'
import { useCurrencyContext } from '../../contexts/currency-context'
import { LIQUIDATION_TARGET_LTV_PRECISION, max } from '../../utils/bigint'
import { dollarValue } from '../../utils/numbers'
import { useBorrowContext } from '../../contexts/borrow-context'
import EditCollateralModal from '../../components/modal/edit-collateral-modal'

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

  const currentLtv = useMemo(() => {
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
    <EditCollateralModal
      position={position}
      onClose={onClose}
      addCollateral={addCollateral}
      removeCollateral={removeCollateral}
      prices={prices}
      value={value}
      setValue={setValue}
      isWithdrawCollateral={isWithdrawCollateral}
      setIsWithdrawCollateral={setIsWithdrawCollateral}
      amount={amount}
      availableCollateralAmount={availableCollateralAmount}
      currentLtv={currentLtv}
    />
  )
}

export default EditCollateralModalContainer
