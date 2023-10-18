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
    <EditExpiryModal
      position={position}
      onClose={onClose}
      balances={balances}
      extendLoanDuration={extendLoanDuration}
      shortenLoanDuration={shortenLoanDuration}
      epochs={epochs}
      setEpochs={setEpochs}
      data={data}
      expiryEpochIndex={expiryEpochIndex}
      interest={interest}
      payable={payable}
      refund={refund}
      refundable={refundable}
    />
  )
}

export default EditExpiryModalContainer
