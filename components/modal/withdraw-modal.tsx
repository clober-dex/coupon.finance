import React from 'react'
import { formatUnits } from 'viem'

import { BondPosition } from '../../model/bond-position'
import CurrencyAmountInput from '../../components/currency-amount-input'
import Modal from '../../components/modal/modal'
import { BigDecimal } from '../../utils/numbers'

const WithdrawModal = ({
  position,
  onClose,
  value,
  setValue,
  maxWithdrawAmount,
  repurchaseFee,
  actionButton,
  depositAssetPrice,
}: {
  position: BondPosition | null
  onClose: () => void
  value: string
  setValue: (value: string) => void
  maxWithdrawAmount: bigint
  repurchaseFee: bigint
  actionButton: React.ReactNode
  depositAssetPrice?: BigDecimal
}) => {
  if (!position) {
    return <></>
  }
  return (
    <Modal
      show
      onClose={() => {
        setValue('')
        onClose()
      }}
    >
      <h1 className="font-bold text-sm sm:text-xl mb-4 sm:mb-6">
        How much would you like to withdraw?
      </h1>
      <div className="mb-4">
        <CurrencyAmountInput
          currency={position.underlying}
          value={value}
          onValueChange={setValue}
          availableAmount={maxWithdrawAmount}
          price={depositAssetPrice}
        />
      </div>
      <div className="flex text-xs sm:text-sm gap-3 mb-2 sm:mb-3 justify-between sm:justify-start">
        <span className="text-gray-500">Your deposit amount</span>
        {formatUnits(position.amount, position.underlying.decimals)}{' '}
        {position.underlying.symbol}
      </div>
      <div className="flex text-xs sm:text-sm gap-3 mb-6 sm:mb-8 justify-between sm:justify-start">
        <span className="text-gray-500">Coupon repurchase fee</span>
        {formatUnits(repurchaseFee, position.underlying.decimals)}{' '}
        {position.underlying.symbol}
      </div>
      {actionButton}
    </Modal>
  )
}

export default WithdrawModal
