import React, { useMemo, useState } from 'react'
import { isAddressEqual, parseUnits } from 'viem'
import { useQuery } from 'wagmi'

import { BondPosition } from '../../model/bond-position'
import { useCurrencyContext } from '../../contexts/currency-context'
import { fetchMarkets } from '../../apis/market'
import { useDepositContext } from '../../contexts/deposit-context'
import { calculateCouponsToWithdraw } from '../../model/market'
import WithdrawModal from '../../components/modal/withdraw-modal'
import { min } from '../../utils/bigint'

const WithdrawModalContainer = ({
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

  const { data } = useQuery(
    ['coupon-repurchase-fee-to-withdraw', position?.underlying.address, amount],
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
        position.amount,
        amount,
      )
    },
    {
      keepPreviousData: true,
    },
  )

  const [maxRepurchaseFee, repurchaseFee, available] = useMemo(
    () =>
      data
        ? [data.maxRepurchaseFee, data.repurchaseFee, data.available]
        : [0n, 0n, 0n],
    [data],
  )

  return position ? (
    <WithdrawModal
      position={position}
      onClose={onClose}
      value={value}
      setValue={setValue}
      repurchaseFee={repurchaseFee}
      maxWithdrawAmount={min(position.amount - maxRepurchaseFee, available)}
      actionButton={
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
      }
      depositAssetPrice={prices[position.underlying.address]}
    />
  ) : (
    <></>
  )
}

export default WithdrawModalContainer
