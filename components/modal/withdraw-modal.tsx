import React, { useMemo, useState } from 'react'
import { formatUnits, isAddressEqual, parseUnits } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { min } from 'hardhat/internal/util/bigint'

import { BondPosition } from '../../model/bond-position'
import CurrencyAmountInput from '../currency-amount-input'
import { useCurrencyContext } from '../../contexts/currency-context'
import { fetchMarkets } from '../../api/market'
import { useDepositContext } from '../../contexts/deposit-context'
import { calculateCouponsToWithdraw } from '../../model/market'

import Modal from './modal'

const WithdrawModal = ({
  position,
  onClose,
}: {
  position: BondPosition | null
  onClose: () => void
}) => {
  const [value, setValue] = useState('')
  const { prices } = useCurrencyContext()
  const { withdraw } = useDepositContext()

  const amount = useMemo(
    () => (position ? parseUnits(value, position.underlying.decimals) : 0n),
    [position, value],
  )
  const positionAmount = useMemo(
    () => (position ? BigInt(position.amount) : 0n),
    [position],
  )

  const { data } = useQuery(
    [
      'coupon-repurchase-fee-to-withdraw',
      position?.underlying.address,
      amount.toString(),
    ],
    async () => {
      if (!position) {
        return {
          maxRepurchaseFee: 0n,
          repurchaseFee: 0n,
          available: 0n,
        }
      }
      const markets = (await fetchMarkets())
        .filter((market) =>
          isAddressEqual(
            market.quoteToken.address,
            position.substitute.address,
          ),
        )
        .filter((market) => market.epoch <= position.toEpoch.id)
      return calculateCouponsToWithdraw(
        position.substitute,
        markets,
        positionAmount,
        amount,
      )
    },
    {
      keepPreviousData: true,
    },
  )

  const maxRepurchaseFee = useMemo(() => data?.maxRepurchaseFee ?? 0n, [data])
  const repurchaseFee = useMemo(() => data?.repurchaseFee ?? 0n, [data])
  const available = useMemo(() => data?.available ?? 0n, [data])

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
          balance={min(positionAmount - maxRepurchaseFee, available)}
          price={prices[position.underlying.address]}
        />
      </div>
      <div className="flex text-xs sm:text-sm gap-3 mb-2 sm:mb-3 justify-between sm:justify-start">
        <span className="text-gray-500">Your deposit amount</span>
        {formatUnits(positionAmount, position.underlying.decimals)}{' '}
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
          amount > min(positionAmount - maxRepurchaseFee, available)
        }
        className="font-bold text-base sm:text-xl bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
        onClick={async () => {
          await withdraw(
            position.underlying,
            BigInt(position.tokenId),
            amount,
            repurchaseFee,
          )
          setValue('')
          onClose()
        }}
      >
        {amount > available
          ? 'Not enough coupons for sale'
          : amount > positionAmount
          ? 'Not enough deposited'
          : amount + maxRepurchaseFee > positionAmount
          ? 'Cannot cover repurchase fee'
          : 'Confirm'}
      </button>
    </Modal>
  )
}

export default WithdrawModal
