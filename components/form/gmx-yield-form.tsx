import React from 'react'

import { ActionButton, ActionButtonProps } from '../button/action-button'
import SlippageSelect from '../selector/slippage-select'
import CurrencyAmountInput from '../input/currency-amount-input'
import { Currency } from '../../model/currency'
import Slider from '../slider/slider'
import {
  currentTimestampInSeconds,
  getDaysBetweenDates,
  getNextMonthStartTimestamp,
  SECONDS_IN_MONTH,
} from '../../utils/date'
import { DotSvg } from '../svg/dot-svg'
import { BigDecimal } from '../../utils/numbers'

export const GmxYieldForm = ({
  collateral1Currency,
  collateral1Value,
  setCollateral1Value,
  maxCollateral1Amount,
  collateral1Price,
  collateral2Currency,
  collateral2Value,
  setCollateral2Value,
  maxCollateral2Amount,
  collateral2Price,
  collateral3Currency,
  collateral3Value,
  setCollateral3Value,
  maxCollateral3Amount,
  collateral3Price,
  borrowCurrency,
  borrowValue,
  setBorrowValue,
  maxBorrowAmount,
  borrowPrice,
  interestsByEpochsBorrowed,
  epochs,
  setEpochs,
  borrowApy,
  borrowLTV,
  actionButtonProps,
}: {
  collateral1Currency: Currency
  collateral1Value: string
  setCollateral1Value: (value: string) => void
  maxCollateral1Amount: bigint
  collateral1Price?: BigDecimal
  collateral2Currency: Currency
  collateral2Value: string
  setCollateral2Value: (value: string) => void
  maxCollateral2Amount: bigint
  collateral2Price?: BigDecimal
  collateral3Currency: Currency
  collateral3Value: string
  setCollateral3Value: (value: string) => void
  maxCollateral3Amount: bigint
  collateral3Price?: BigDecimal
  borrowCurrency: Currency
  borrowValue: string
  setBorrowValue: (value: string) => void
  maxBorrowAmount: bigint
  borrowPrice?: BigDecimal
  interestsByEpochsBorrowed?: { date: string; apy: number }[]
  epochs: number
  setEpochs: (value: number) => void
  borrowApy: number
  borrowLTV: number
  actionButtonProps: ActionButtonProps
}) => {
  const currentTimestamp = currentTimestampInSeconds()
  const leftMonthInSecond =
    getNextMonthStartTimestamp(currentTimestamp) - currentTimestamp
  const minPosition =
    (leftMonthInSecond /
      (leftMonthInSecond +
        SECONDS_IN_MONTH *
          (interestsByEpochsBorrowed ? interestsByEpochsBorrowed.length : 1))) *
    100
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col bg-white gap-8 dark:bg-gray-900 rounded-2xl sm:rounded-3xl px-6 pt-6 pb-8 w-full sm:w-[480px]">
        <div className="flex flex-col gap-4 items-stretch">
          <div className="font-bold text-sm sm:text-lg">
            How much collateral you’d like to add?
          </div>
          <div className="flex flex-col items-stretch gap-3">
            <CurrencyAmountInput
              currency={collateral1Currency}
              value={collateral1Value}
              onValueChange={setCollateral1Value}
              availableAmount={maxCollateral1Amount}
              price={collateral1Price}
            />
            <CurrencyAmountInput
              currency={collateral2Currency}
              value={collateral2Value}
              onValueChange={setCollateral2Value}
              availableAmount={maxCollateral2Amount}
              price={collateral2Price}
            />
            <CurrencyAmountInput
              currency={collateral3Currency}
              value={collateral3Value}
              onValueChange={setCollateral3Value}
              availableAmount={maxCollateral3Amount}
              price={collateral3Price}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="font-bold text-sm sm:text-lg">
            How much you’d like to borrow?
          </div>
          <CurrencyAmountInput
            currency={borrowCurrency}
            value={borrowValue}
            onValueChange={setBorrowValue}
            availableAmount={maxBorrowAmount}
            price={borrowPrice}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="font-bold text-sm sm:text-lg">
              How long you’d like to secure your loan?
            </div>
            <div className="text-gray-400 text-xs sm:text-sm">
              You can exit your position anytime before expiry.
            </div>
          </div>
          <div className="flex justify-between flex-col relative bg-white dark:bg-gray-900 rounded-lg p-4 pb-8 sm:pb-0 sm:h-[90px]">
            {interestsByEpochsBorrowed === undefined ? (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div
                  className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-green-500 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                />
              </div>
            ) : (
              <></>
            )}
            {interestsByEpochsBorrowed &&
            interestsByEpochsBorrowed.length > 0 ? (
              <div className="sm:px-6 sm:mb-2 mr-4 sm:mr-0">
                <div>
                  <Slider
                    minPosition={minPosition}
                    length={interestsByEpochsBorrowed?.length ?? 0}
                    value={epochs}
                    onValueChange={setEpochs}
                  >
                    <div className="flex w-[110px] flex-col items-center gap-2 shrink-0">
                      <div className="flex px-2 py-1 justify-center items-center gap-1 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-white text-xs font-bold">
                        {getDaysBetweenDates(
                          new Date(interestsByEpochsBorrowed[epochs - 1].date),
                          new Date(currentTimestamp * 1000),
                        )}{' '}
                        Days
                      </div>
                      <DotSvg />
                      <div className="flex px-2 py-1 justify-center items-center gap-1 rounded-2xl bg-green-500 bg-opacity-10 text-xs text-green-500 font-bold">
                        {interestsByEpochsBorrowed[epochs - 1].date}
                      </div>
                    </div>
                  </Slider>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-stretch bg-white gap-6 dark:bg-gray-900 rounded-2xl sm:rounded-3xl p-6 w-full sm:w-[480px]">
        <div className="flex flex-col items-stretch gap-6">
          <div className="flex items-center">
            <div className="flex-grow flex-shrink-0 basis-0 text-lg font-bold">
              Transaction Overview
            </div>
            <SlippageSelect
              show={false}
              setShow={() => {}}
              slippage={'3'}
              setSlippage={() => {}}
            />
          </div>
          <div className="flex flex-col items-stretch gap-3 text-gray-400 text-base">
            <div className="flex">
              <div>APY</div>
              <div className="flex ml-auto">{borrowApy.toFixed(2)}%</div>
            </div>
            <div className="flex">
              <div>LTV</div>
              <div className="flex ml-auto">{borrowLTV.toFixed(2)}%</div>
            </div>
            <div className="flex">
              <div>Liquidation LTV</div>
              <div className="flex ml-auto">80.00%</div>
            </div>
            <div className="flex">
              <div>Collateral position</div>
              <div className="flex ml-auto">0.0000 BTC-USDC GM</div>
            </div>
          </div>
        </div>
        <ActionButton {...actionButtonProps} />
      </div>
    </div>
  )
}
