import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'wagmi'

import Slider from '../slider'
import { LoanPosition } from '../../model/loan-position'
import { fetchCouponAmountByEpochsBorrowed } from '../../api/market'

import Modal from './modal'

const EditExpiryModal = ({
  position,
  onClose,
}: {
  position: LoanPosition
  onClose: () => void
}) => {
  const [selected, setSelected] = useState(0)

  const { data } = useQuery(
    ['coupon-amount-to-edit-expiry', position],
    () => {
      return fetchCouponAmountByEpochsBorrowed(
        position.substitute,
        position.amount,
        position.toEpoch.id,
      )
    },
    {
      enabled: !!position,
    },
  )

  const [refund, interest] = useMemo(() => {
    if (!data) {
      return [0n, 0n]
    }
    return [
      data?.[selected - 1]?.refund ?? 0n,
      data?.[selected - 1]?.interest ?? 0n,
    ]
  }, [data, selected])
  console.log(refund, interest)

  useEffect(() => {
    const id = data?.findIndex(
      (item) => item.interest === 0n && item.refund === 0n,
    )
    if (id !== undefined) {
      setSelected(id + 1)
    }
  }, [data])

  return (
    <Modal show={!!position} onClose={onClose}>
      <h1 className="font-bold text-xl mb-3">Please select expiry date</h1>
      <div className="text-gray-500 text-sm mb-8">
        To select a further date, more interest must be paid.
        <br />
        Select an earlier date to receive a refund on interest paid.
      </div>
      <div className="flex flex-col relative bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
        <div className="px-6 mb-2">
          <Slider length={4} value={selected} onValueChange={setSelected} />
        </div>
        <div className="flex justify-between">
          {(data || []).map(({ date }, i) => (
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
        disabled={true}
        className="font-bold text-xl disabled:bg-gray-100 dark:disabled:bg-gray-800 h-16 rounded-lg disabled:text-gray-300 dark:disabled:text-gray-500"
      >
        Confirm
      </button>
    </Modal>
  )
}

export default EditExpiryModal
