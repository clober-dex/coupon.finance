import React, { useMemo, useState } from 'react'
import { useQuery } from 'wagmi'

import { BondPosition } from '../../model/bond-position'
import { useCurrencyContext } from '../../contexts/currency-context'
import { fetchMarketsByQuoteTokenAddress } from '../../apis/market'
import { useDepositContext } from '../../contexts/deposit-context'
import { calculateCouponsToWithdraw } from '../../model/market'
import WithdrawModal from '../../components/modal/withdraw-modal'
import { min } from '../../utils/bigint'
import { useChainContext } from '../../contexts/chain-context'
import { parseUnits } from '../../utils/numbers'

const WithdrawModalContainer = ({
  position,
  onClose,
}: {
  position: BondPosition | null
  onClose: () => void
}) => {
  const { selectedChain } = useChainContext()
  const [value, setValue] = useState('')
  const { prices } = useCurrencyContext()
  const { withdraw } = useDepositContext()

  const amount = useMemo(
    () => (position ? parseUnits(value, position.underlying.decimals) : 0n),
    [position, value],
  )

  const { data } = useQuery(
    [
      'coupon-repurchase-fee-to-withdraw',
      position?.underlying.address,
      amount,
      selectedChain,
    ],
    async () => {
      if (!position) {
        return {
          maxRepurchaseFee: 0n,
          repurchaseFee: 0n,
          available: 0n,
        }
      }
      const markets = (
        await fetchMarketsByQuoteTokenAddress(
          selectedChain.id,
          position.substitute.address,
        )
      ).filter((market) => market.epoch <= position.toEpoch.id)
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
  const withdrawAll = useMemo(
    () => amount + maxRepurchaseFee >= (position?.amount ?? 0n),
    [amount, maxRepurchaseFee, position?.amount],
  )

  return position ? (
    <WithdrawModal
      depositCurrency={position.underlying}
      depositedAmount={position.amount}
      withdrawAmount={amount}
      onClose={onClose}
      value={value}
      setValue={setValue}
      repurchaseFee={repurchaseFee}
      maxWithdrawAmount={min(position.amount - maxRepurchaseFee, available)}
      actionButtonProps={{
        disabled:
          amount === 0n ||
          amount > available - maxRepurchaseFee ||
          amount > position.amount ||
          amount > position.amount - maxRepurchaseFee,
        onClick: async () => {
          await withdraw(
            position.underlying,
            position.tokenId,
            amount,
            withdrawAll
              ? maxRepurchaseFee
              : min(repurchaseFee, maxRepurchaseFee),
          )
          setValue('')
          onClose()
        },
        text:
          amount > available - maxRepurchaseFee
            ? 'Not enough coupons for sale'
            : amount > position.amount
            ? 'Not enough deposited'
            : amount > position.amount - maxRepurchaseFee
            ? 'Cannot cover repurchase fee'
            : 'Withdraw',
      }}
      depositAssetPrice={prices[position.underlying.address]}
    />
  ) : (
    <></>
  )
}

export default WithdrawModalContainer
