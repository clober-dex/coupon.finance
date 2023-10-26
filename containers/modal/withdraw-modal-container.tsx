import React, { useMemo, useState } from 'react'
import { isAddressEqual, parseUnits } from 'viem'
import { useNetwork, useQuery } from 'wagmi'

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
  const { chain } = useNetwork()
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
      if (!position || !chain) {
        return {
          maxRepurchaseFee: 0n,
          repurchaseFee: 0n,
          available: 0n,
        }
      }
      const markets = (await fetchMarkets(chain.id))
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
      depositCurrency={position.underlying}
      depositAmount={position.amount}
      onClose={onClose}
      value={value}
      setValue={setValue}
      repurchaseFee={repurchaseFee}
      maxWithdrawAmount={min(position.amount - maxRepurchaseFee, available)}
      actionButtonProps={{
        disabled:
          amount === 0n ||
          amount > min(position.amount - maxRepurchaseFee, available),
        onClick: async () => {
          await withdraw(
            position.underlying,
            position.tokenId,
            amount,
            min(repurchaseFee, maxRepurchaseFee),
          )
          setValue('')
          onClose()
        },
        text:
          amount > available
            ? 'Not enough coupons for sale'
            : amount > position.amount
            ? 'Not enough deposited'
            : amount + maxRepurchaseFee > position.amount
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
