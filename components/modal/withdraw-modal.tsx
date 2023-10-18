import React from 'react'
import { formatUnits } from 'viem'
import { min } from 'hardhat/internal/util/bigint'

import { BondPosition } from '../../model/bond-position'
import CurrencyAmountInput from '../../components/currency-amount-input'
import Modal from '../../components/modal/modal'
import { Currency } from '../../model/currency'
import { Prices } from '../../model/prices'

const WithdrawModal = ({
  position,
  onClose,
  value,
  setValue,
  prices,
  withdraw,
  amount,
  maxRepurchaseFee,
  repurchaseFee,
  available,
}: {
  position: BondPosition | null
  onClose: () => void
  value: string
  setValue: (value: string) => void
  prices: Prices
  withdraw: (
    asset: Currency,
    tokenId: bigint,
    amount: bigint,
    repurchaseFee: bigint,
  ) => Promise<void>
  amount: bigint
  maxRepurchaseFee: bigint
  repurchaseFee: bigint
  available: bigint
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
          balance={min(position.amount - maxRepurchaseFee, available)}
          price={prices[position.underlying.address]}
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
      <button
        disabled={
          amount === 0n ||
          amount > min(position.amount - maxRepurchaseFee, available)
        }
        className="font-bold text-base sm:text-xl bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
        onClick={async () => {
          await withdraw(
            position.underlying,
            position.tokenId,
            amount,
            repurchaseFee,
          )
          setValue('')
          onClose()
        }}
      >
        {amount > available
          ? 'Not enough coupons for sale'
          : amount > position.amount
          ? 'Not enough deposited'
          : amount + maxRepurchaseFee > position.amount
          ? 'Cannot cover repurchase fee'
          : 'Confirm'}
      </button>
    </Modal>
  )
}

export default WithdrawModal
