import CountUp from 'react-countup'
import React, { useCallback } from 'react'
import { Tooltip } from 'react-tooltip'

import { Currency } from '../../model/currency'
import CurrencyAmountInput from '../input/currency-amount-input'
import { BigDecimal, formatUnits } from '../../utils/numbers'
import { ActionButton, ActionButtonProps } from '../button/action-button'
import { RemainingCoupon } from '../../model/market'
import {
  currentTimestampInSeconds,
  getDaysBetweenDates,
  getNextMonthStartTimestamp,
  SECONDS_IN_MONTH,
} from '../../utils/date'
import Slider from '../slider/slider'
import { DotSvg } from '../svg/dot-svg'

export const DepositForm = ({
  depositCurrency,
  maxDepositAmount,
  proceed,
  depositApy,
  proceedsByEpochsDeposited,
  remainingCoupons,
  value,
  setValue,
  epochs,
  setEpochs,
  actionButtonProps,
  depositAssetPrice,
}: {
  depositCurrency: Currency
  maxDepositAmount: bigint
  proceed: bigint
  depositApy: number
  proceedsByEpochsDeposited?: { date: string; proceeds: bigint }[]
  remainingCoupons?: RemainingCoupon[]
  value: string
  setValue: (value: string) => void
  epochs: number
  setEpochs: (value: number) => void
  actionButtonProps: ActionButtonProps
  depositAssetPrice?: BigDecimal
}) => {
  const countUpFormatter = useCallback(
    (value: number) =>
      `${formatUnits(
        BigInt(value),
        depositCurrency.decimals,
        depositAssetPrice,
      )} ${depositCurrency.symbol}`,
    [depositAssetPrice, depositCurrency.decimals, depositCurrency.symbol],
  )

  const currentTimestamp = currentTimestampInSeconds()
  const leftMonthInSecond =
    getNextMonthStartTimestamp(currentTimestamp) - currentTimestamp
  const minPosition =
    (leftMonthInSecond /
      (leftMonthInSecond +
        SECONDS_IN_MONTH *
          (proceedsByEpochsDeposited ? proceedsByEpochsDeposited.length : 1))) *
    100
  return (
    <div className="relative">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col bg-white gap-4 dark:bg-gray-900 sm:rounded-3xl p-4 sm:p-6 sm:pb-4 w-full sm:w-[480px]">
          <div className="flex flex-col gap-4">
            <div className="font-bold text-sm sm:text-lg">
              How much would you like to deposit?
            </div>
            <CurrencyAmountInput
              currency={depositCurrency}
              value={value}
              onValueChange={setValue}
              availableAmount={maxDepositAmount}
              price={depositAssetPrice}
            />
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="font-bold text-sm sm:text-lg">
                How long you’d like to secure your deposit?
              </div>
              <div className="text-gray-500 text-xs sm:text-sm">
                You can exit your position anytime before expiry.
              </div>
            </div>
            <div className="flex justify-between flex-col relative bg-white dark:bg-gray-900 rounded-lg p-4 pb-8 sm:pb-0 sm:h-[90px]">
              {proceedsByEpochsDeposited === undefined ? (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div
                    className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-green-500 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  />
                </div>
              ) : (
                <></>
              )}
              {proceedsByEpochsDeposited &&
              proceedsByEpochsDeposited.length > 0 ? (
                <div className="sm:px-6 sm:mb-2 mr-4 sm:mr-0">
                  <div>
                    <Slider
                      segments={proceedsByEpochsDeposited?.length ?? 0}
                      minPosition={minPosition}
                      value={epochs}
                      onValueChange={setEpochs}
                      renderControl={() => (
                        <div className="flex w-[96px] flex-col items-center gap-3 shrink-0">
                          <div className="flex px-2 py-1 justify-center items-center gap-1 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-white text-xs font-bold">
                            {getDaysBetweenDates(
                              new Date(proceedsByEpochsDeposited[epochs].date),
                              new Date(currentTimestamp * 1000),
                            )}{' '}
                            Days
                          </div>
                          <DotSvg />
                          <div className="flex px-2 py-1 justify-center items-center gap-1 rounded-2xl bg-green-500 bg-opacity-10 text-xs text-green-500 font-bold">
                            +
                            {proceedsByEpochsDeposited[epochs].proceeds === 0n
                              ? '0.00'
                              : formatUnits(
                                  proceedsByEpochsDeposited[epochs].proceeds,
                                  depositCurrency.decimals,
                                  depositAssetPrice,
                                )}
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
          </div>
        </div>
        <div className="flex flex-col bg-white gap-6 dark:bg-gray-900 sm:rounded-3xl p-4 sm:p-6 w-full sm:w-[480px]">
          <div className="flex flex-col items-start gap-6 self-stretch">
            <div className="text-lg font-bold">You earn...</div>
            <div className="flex flex-col items-start gap-3 self-stretch">
              <div className="flex w-full">
                <div className="text-gray-400 text-base">Interest</div>
                <div className="ml-auto">
                  <CountUp
                    end={Number(proceed)}
                    suffix={` ${depositCurrency.symbol}`}
                    formattingFn={countUpFormatter}
                    preserveValue
                  />
                </div>
              </div>
              <div className="flex w-full">
                <div className="text-gray-400 text-base">APY</div>
                <div className="ml-auto">
                  {Number.isNaN(depositApy) ? 0 : depositApy.toFixed(2)}%
                </div>
              </div>
              {epochs &&
              remainingCoupons &&
              remainingCoupons.reduce((a, b) => a + b.remainingCoupon, 0n) >
                0n ? (
                <div className="flex w-full">
                  <div className="text-gray-400 text-base">
                    Coupon <Tooltip id="remaning-coupon" />
                  </div>
                  <div className="flex flex-col gap-2 ml-auto">
                    {remainingCoupons
                      .filter(({ remainingCoupon }) => remainingCoupon !== 0n)
                      .map(({ date, remainingCoupon }, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <div className="text-base">
                            +
                            {formatUnits(
                              remainingCoupon,
                              depositCurrency.decimals,
                              depositAssetPrice,
                            )}{' '}
                          </div>
                          <div className="text-gray-500 text-base ml-auto">
                            {date}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          <ActionButton {...actionButtonProps} />
        </div>
      </div>
    </div>
  )
}
