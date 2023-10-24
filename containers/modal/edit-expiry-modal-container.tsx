import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'wagmi'

import { LoanPosition } from '../../model/loan-position'
import { fetchCouponAmountByEpochsBorrowed } from '../../apis/market'
import { useBorrowContext } from '../../contexts/borrow-context'
import { useCurrencyContext } from '../../contexts/currency-context'
import EditExpiryModal from '../../components/modal/edit-expiry-modal'

const EditExpiryModalContainer = ({
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

  const { data } = useQuery(['edit-expiry-simulate', position], () =>
    fetchCouponAmountByEpochsBorrowed(
      position.substitute,
      position.amount,
      position.toEpoch.id,
    ),
  )

  const [expiryEpochIndex, interest, payable, refund, refundable] =
    useMemo(() => {
      if (!data) {
        return [0, 0n, false, 0n, false]
      }
      const expiryEpochIndex = data.findIndex((item) => item.expiryEpoch) + 1
      return [
        expiryEpochIndex,
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
    }, [data, epochs])

  useEffect(() => {
    if (expiryEpochIndex > 0) {
      _setEpochs(expiryEpochIndex)
    }
  }, [expiryEpochIndex, position, _setEpochs])

  return (
    <EditExpiryModal
      onClose={onClose}
      epochs={epochs}
      setEpochs={setEpochs}
      data={data || []}
      actionButton={
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
      }
    />
  )
}

export default EditExpiryModalContainer
