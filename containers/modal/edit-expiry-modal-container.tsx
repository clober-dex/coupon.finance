import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'wagmi'

import { LoanPosition } from '../../model/loan-position'
import { fetchCouponAmountByEpochsBorrowed } from '../../apis/market'
import { useBorrowContext } from '../../contexts/borrow-context'
import { useCurrencyContext } from '../../contexts/currency-context'
import EditExpiryModal from '../../components/modal/edit-expiry-modal'
import { useChainContext } from '../../contexts/chain-context'

const EditExpiryModalContainer = ({
  position,
  onClose,
}: {
  position: LoanPosition
  onClose: () => void
}) => {
  const { selectedChain } = useChainContext()
  const { balances } = useCurrencyContext()
  const { extendLoanDuration, shortenLoanDuration } = useBorrowContext()

  const [epochs, setEpochs] = useState(0)

  const { data } = useQuery(
    ['edit-expiry-simulate', position, selectedChain],
    () =>
      fetchCouponAmountByEpochsBorrowed(
        selectedChain.id,
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
      setEpochs(expiryEpochIndex)
    }
  }, [expiryEpochIndex, position, setEpochs])

  return epochs > 0 ? (
    <EditExpiryModal
      onClose={onClose}
      epochs={epochs}
      setEpochs={setEpochs}
      dateList={data || []}
      actionButtonProps={{
        disabled:
          epochs === 0 ||
          expiryEpochIndex === epochs ||
          (refund === 0n && interest === 0n) ||
          interest > balances[position.underlying.address] ||
          !payable ||
          !refundable,
        onClick: async () => {
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
        },
        text:
          epochs === 0
            ? 'Select expiry date'
            : expiryEpochIndex === epochs
            ? 'Select new expiry date'
            : epochs > expiryEpochIndex && !payable
            ? 'Not enough coupons for pay'
            : epochs < expiryEpochIndex && !refundable
            ? 'Not enough coupons for refund'
            : interest > balances[position.underlying.address]
            ? `Insufficient ${position.underlying.symbol} balance`
            : 'Edit expiry date',
      }}
    />
  ) : (
    <></>
  )
}

export default EditExpiryModalContainer
