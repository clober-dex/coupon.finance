import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'wagmi'

import Slider from '../slider'
import { LoanPosition } from '../../model/loan-position'
import { fetchCouponAmountByEpochsBorrowed } from '../../apis/market'
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
  const [epochs, _setEpochs] = useState(0)

  const setEpochs = useCallback(
    (value: number) => {
      _setEpochs(value === epochs ? value - 1 : value)
    },
    [epochs],
  )

  const { data } = useQuery(['coupon-amount-to-edit-expiry', position], () =>
    fetchCouponAmountByEpochsBorrowed(
      position.substitute,
      position.amount,
      position.toEpoch.id,
    ),
  )

  const expiryEpochIndex = useMemo(() => {
    if (!data) {
      return 0
    }
    return data.findIndex((item) => item.expiryEpoch) + 1
  }, [data])

  const [interest, payable, refund, refundable] = useMemo(() => {
    if (!data) {
      return [0n, false, 0n, false]
    }
    return [
      data
        .slice(expiryEpochIndex, epochs)
        .reduce((acc, { interest }) => acc + interest, 0n),
      data
        .slice(expiryEpochIndex, epochs)
        .reduce((acc, { payable }) => acc && payable, true),
      data
        .slice(epochs - 1, expiryEpochIndex - 1)
        .reduce((acc, { refund }) => acc + refund, 0n),
      data
        .slice(epochs - 1, expiryEpochIndex - 1)
        .reduce((acc, { refundable }) => acc && refundable, true),
    ]
  }, [data, expiryEpochIndex, epochs])

  useEffect(() => {
    if (expiryEpochIndex > 0) {
      _setEpochs(expiryEpochIndex)
    }
  }, [expiryEpochIndex, position, _setEpochs])

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
            value={epochs}
            onValueChange={setEpochs}
          />
        </div>
        <div className="flex justify-between">
          {(data ?? []).map(({ date }, i) => (
            <button
              key={i}
              className="flex flex-col items-center gap-2 w-[72px]"
              onClick={() => setEpochs(i + 1)}
            >
              <div className="text-sm">{date}</div>
            </button>
          ))}
        </div>
      </div>
      <button
        disabled={
          epochs === 0 ||
          expiryEpochIndex === epochs ||
          (refund === 0n && interest === 0n) ||
          interest > balances[position.underlying.address] ||
          !payable ||
          !refundable
        }
        className="font-bold text-base sm:text-xl bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
        onClick={async () => {
          if (epochs > expiryEpochIndex) {
            await extendLoanDuration(
              position.underlying,
              position.id,
              epochs - expiryEpochIndex,
              interest,
            )
          } else if (epochs < expiryEpochIndex) {
            await shortenLoanDuration(
              position.underlying,
              position.id,
              expiryEpochIndex - epochs,
              refund,
            )
          }
          setEpochs(0)
          onClose()
        }}
      >
        {epochs === 0
          ? 'Select expiry date'
          : expiryEpochIndex === epochs
          ? 'Select new expiry date'
          : epochs > expiryEpochIndex && !payable
          ? 'Not enough coupons for pay'
          : epochs < expiryEpochIndex && !refundable
          ? 'Not enough coupons for refund'
          : interest > balances[position.underlying.address]
          ? `Insufficient ${position.underlying.symbol} balance`
          : 'Confirm'}
      </button>
    </Modal>
  )
}

export default EditExpiryModal
