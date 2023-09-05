import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'wagmi'

import Slider from '../slider'
import { LoanPosition } from '../../model/loan-position'
import { fetchCouponAmountByEpochsBorrowed } from '../../api/market'
import { useBorrowContext } from '../../contexts/borrow-context'
import { useCurrencyContext } from '../../contexts/currency-context'

import Modal from './modal'

const EditExpiryModal = ({
  position,
  onClose,
}: {
  position: LoanPosition
  onClose: () => void
}) => {
  const { balances } = useCurrencyContext()
  const { extendLoanDuration, shortenLoanDuration } = useBorrowContext()
  const [selected, setSelected] = useState(0)

  const { data } = useQuery(['coupon-amount-to-edit-expiry', position], () =>
    fetchCouponAmountByEpochsBorrowed(
      position.substitute,
      position.amount,
      position.toEpoch.id,
    ),
  )

  const [refund, interest, available, expiryEpochIndex] = useMemo(() => {
    if (!data) {
      return [0n, 0n, 0n, 0]
    }
    return [
      data?.[selected - 1]?.refund ?? 0n,
      data?.[selected - 1]?.interest ?? 0n,
      data?.[selected - 1]?.available ?? 0n,
      data.findIndex((item) => item.expiryEpoch) + 1,
    ]
  }, [data, selected])

  useEffect(() => {
    if (expiryEpochIndex > 0) {
      setSelected(expiryEpochIndex)
    }
  }, [expiryEpochIndex, position])

  return (
    <Modal show onClose={onClose}>
      <h1 className="font-bold text-xl mb-3">Please select expiry date</h1>
      <div className="text-gray-500 text-sm mb-8">
        To select a further date, more interest must be paid.
        <br />
        Select an earlier date to receive a refund on interest paid.
      </div>
      <div className="flex flex-col relative bg-white dark:bg-gray-900 rounded-lg p-4 mb-8">
        <div className="px-6 mb-2">
          <Slider
            length={data?.length ?? 0}
            value={selected}
            onValueChange={setSelected}
          />
        </div>
        <div className="flex justify-between">
          {(data ?? []).map(({ date }, i) => (
            <button
              key={i}
              className="flex flex-col items-center gap-2 w-[72px]"
              onClick={() => setSelected(i + 1)}
            >
              <div className="text-sm">{date}</div>
            </button>
          ))}
        </div>
      </div>
      <button
        disabled={
          selected === 0 ||
          expiryEpochIndex === selected ||
          (refund === 0n && interest === 0n) ||
          interest > balances[position.underlying.address] ||
          interest > available
        }
        className="font-bold text-base sm:text-xl bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
        onClick={async () => {
          if (selected > expiryEpochIndex) {
            await extendLoanDuration(
              position.underlying,
              position.positionId,
              selected - expiryEpochIndex,
              interest,
            )
          } else if (selected < expiryEpochIndex) {
            await shortenLoanDuration(
              position.underlying,
              position.positionId,
              expiryEpochIndex - selected,
              refund,
            )
          }
          setSelected(0)
          onClose()
        }}
      >
        {selected === 0
          ? 'Select expiry date'
          : expiryEpochIndex === selected
          ? 'Select expiry date'
          : (refund === 0n && interest === 0n) || interest > available
          ? 'Not enough coupons for sale'
          : interest > balances[position.underlying.address]
          ? `Insufficient ${position.underlying.symbol} balance`
          : 'Confirm'}
      </button>
    </Modal>
  )
}

export default EditExpiryModal
