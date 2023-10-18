import React, { useMemo, useState } from 'react'
import { isAddressEqual, parseUnits } from 'viem'
import { useQuery } from 'wagmi'

import { BondPosition } from '../../model/bond-position'
import { useCurrencyContext } from '../../contexts/currency-context'
import { fetchMarkets } from '../../apis/market'
import { useDepositContext } from '../../contexts/deposit-context'
import { calculateCouponsToWithdraw } from '../../model/market'
import WithdrawModal from '../../components/modal/withdraw-modal'

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

  const maxRepurchaseFee = useMemo(() => data?.maxRepurchaseFee ?? 0n, [data])
  const repurchaseFee = useMemo(() => data?.repurchaseFee ?? 0n, [data])
  const available = useMemo(() => data?.available ?? 0n, [data])

  return (
    <WithdrawModal
      position={position}
      onClose={onClose}
      value={value}
      setValue={setValue}
      prices={prices}
      withdraw={withdraw}
      amount={amount}
      maxRepurchaseFee={maxRepurchaseFee}
      repurchaseFee={repurchaseFee}
      available={available}
    />
  )
}

export default WithdrawModalContainer
