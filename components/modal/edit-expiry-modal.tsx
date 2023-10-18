import React from 'react'

import Slider from '../../components/slider'
import { LoanPosition } from '../../model/loan-position'
import Modal from '../../components/modal/modal'
import { Currency } from '../../model/currency'
import { Balances } from '../../model/balances'

const EditExpiryModal = ({
  position,
  onClose,
  balances,
  extendLoanDuration,
  shortenLoanDuration,
  epochs,
  setEpochs,
  data,
  expiryEpochIndex,
  interest,
  payable,
  refund,
  refundable,
}: {
  position: LoanPosition
  onClose: () => void
  balances: Balances
  extendLoanDuration: (
    underlying: Currency,
    positionId: bigint,
    epochs: number,
    expectedInterest: bigint,
  ) => Promise<void>
  shortenLoanDuration: (
    underlying: Currency,
    positionId: bigint,
    epochs: number,
    expectedProceeds: bigint,
  ) => Promise<void>
  epochs: number
  setEpochs: (value: number) => void
  data:
    | {
        date: string
        interest: bigint
        payable: boolean
        refund: bigint
        refundable: boolean
        expiryEpoch: boolean
      }[]
    | undefined
  expiryEpochIndex: number
  interest: bigint
  payable: boolean
  refund: bigint
  refundable: boolean
}) => {
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
