import React from 'react'

import Modal from '../../components/modal/modal'
import { ActionButton, ActionButtonProps } from '../button/action-button'
import {
  currentTimestampInSeconds,
  getDaysBetweenDates,
  getNextMonthStartTimestamp,
  SECONDS_IN_MONTH,
} from '../../utils/date'
import Slider from '../slider'
import { DotSvg } from '../svg/dot-svg'
import { BigDecimal, formatUnits } from '../../utils/numbers'
import { Currency } from '../../model/currency'

const EditExpiryModal = ({
  onClose,
  epochs,
  setEpochs,
  currency,
  price,
  dateList,
  interest,
  refund,
  actionButtonProps,
}: {
  onClose: () => void
  epochs: number
  setEpochs: (value: number) => void
  currency: Currency
  price: BigDecimal
  dateList: string[]
  interest: bigint
  refund: bigint
  actionButtonProps: ActionButtonProps
}) => {
  const currentTimestamp = currentTimestampInSeconds()
  const leftMonthInSecond =
    getNextMonthStartTimestamp(currentTimestamp) - currentTimestamp
  const minPosition =
    (leftMonthInSecond /
      (leftMonthInSecond +
        SECONDS_IN_MONTH * (dateList ? dateList.length : 1))) *
    100
  return (
    <Modal show onClose={onClose}>
      <h1 className="font-bold text-xl mb-3">Please select expiry date</h1>
      <div className="text-gray-500 text-sm mb-4">
        To select a further date, more interest must be paid. Select an earlier
        date to receive a refund on interest paid.
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between flex-col relative rounded-lg pl-4 pr-12 sm:pl-0 sm:pr-6 sm:py-10">
            {dateList.length === 0 ? (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div
                  className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-green-500 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                />
              </div>
            ) : (
              <></>
            )}
            {dateList && dateList.length > 0 ? (
              <div className="sm:px-6 sm:mb-2 my-8 sm:my-0">
                <div>
                  <Slider
                    minPosition={minPosition}
                    segments={dateList?.length ?? 0}
                    value={epochs}
                    onValueChange={setEpochs}
                    renderControl={() => (
                      <div className="flex w-[110px] flex-col items-center gap-2 shrink-0">
                        <div className="flex px-2 py-1 justify-center items-center gap-1 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-white text-xs font-bold">
                          {getDaysBetweenDates(
                            new Date(dateList[epochs]),
                            new Date(currentTimestamp * 1000),
                          )}{' '}
                          Days
                        </div>
                        <DotSvg />
                        <div className="flex px-2 py-1 justify-center items-center gap-1 rounded-2xl bg-green-500 bg-opacity-10 text-xs text-green-500 font-bold">
                          {dateList[epochs]}
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="flex items-start self-stretch">
            <div className="text-gray-400 text-base">
              {interest > 0n ? 'Interest' : refund > 0n ? 'Refund' : ''}
            </div>
            <div className="ml-auto text-base text-black dark:text-white">
              {interest > 0n
                ? formatUnits(interest, currency.decimals, price)
                : refund > 0n
                ? formatUnits(refund, currency.decimals, price)
                : '0'}{' '}
              {currency.symbol}
            </div>
          </div>
        </div>
        <ActionButton {...actionButtonProps} />
      </div>
    </Modal>
  )
}

export default EditExpiryModal
