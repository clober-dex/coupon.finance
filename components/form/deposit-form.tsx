import CountUp from 'react-countup'
import React from 'react'

import { Currency } from '../../model/currency'
import CurrencyAmountInput from '../currency-amount-input'
import Slider from '../slider'
import { BigDecimal, formatUnits } from '../../utils/numbers'
import { ActionButton, ActionButtonProps } from '../action-button'
import { RightBracketAngleSvg } from '../svg/right-bracket-angle-svg'

export const DepositForm = ({
  depositCurrency,
  maxDepositAmount,
  proceed,
  depositApy,
  proceedsByEpochsDeposited,
  value,
  setValue,
  epochs,
  setEpochs,
  showRiskSidebar,
  setShowRiskSidebar,
  actionButtonProps,
  depositAssetPrice,
}: {
  depositCurrency: Currency
  maxDepositAmount: bigint
  proceed: bigint
  depositApy: number
  proceedsByEpochsDeposited?: { date: string; proceeds: bigint }[]
  value: string
  setValue: (value: string) => void
  epochs: number
  setEpochs: (value: number) => void
  showRiskSidebar: boolean
  setShowRiskSidebar: (show: boolean) => void
  actionButtonProps: ActionButtonProps
  depositAssetPrice?: BigDecimal
}) => {
  return (
    <div className="relative z-30">
      <div className="flex flex-col sm:shadow bg-gray-50 dark:bg-gray-950 sm:dark:bg-gray-900 sm:rounded-3xl p-4 sm:p-6 w-full sm:w-[480px] gap-8">
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
              Select expiration date.
            </div>
            <div className="text-gray-500 text-xs sm:text-sm">
              The longer you deposit, the more interest you earn!
            </div>
          </div>
          <div className="flex flex-row-reverse justify-between sm:flex-col relative bg-white dark:bg-gray-800 rounded-lg p-4 sm:h-[116px]">
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
            <div className="sm:px-6 sm:mb-2">
              <div>
                <Slider
                  length={proceedsByEpochsDeposited?.length ?? 0}
                  value={epochs}
                  onValueChange={setEpochs}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between">
              {(proceedsByEpochsDeposited ?? []).map(
                ({ date, proceeds }, index) => (
                  <button
                    key={index}
                    className="flex sm:flex-col items-center gap-1 sm:gap-2 sm:w-[72px]"
                    onClick={() => setEpochs(index + 1)}
                  >
                    <div className="text-sm w-20 sm:w-fit text-start">
                      {date}
                    </div>
                    <div
                      className={
                        'px-2 py-1 rounded-full text-xs bg-green-500 text-green-500 bg-opacity-10'
                      }
                    >
                      {`+${Number(
                        formatUnits(
                          proceeds,
                          depositCurrency.decimals,
                          depositAssetPrice,
                        ),
                      ).toFixed(2)}`}
                    </div>
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
        <div className="flex p-4 border-solid border-[1.5px] border-gray-200 dark:border-gray-700 rounded-lg gap-2 sm:gap-3">
          <div className="flex flex-col flex-1">
            <label className="font-bold text-sm sm:text-lg">
              Your interest payout will be
            </label>
            <CountUp
              end={Number(proceed)}
              suffix={` ${depositCurrency.symbol}`}
              className={`flex gap-2 ${
                epochs === 0 ? 'text-gray-400' : ''
              } text-xl`}
              formattingFn={(value) =>
                `${formatUnits(
                  BigInt(value),
                  depositCurrency.decimals,
                  depositAssetPrice,
                )} ${depositCurrency.symbol}`
              }
              preserveValue
            />
          </div>
          <div className="flex px-2 sm:px-3 py-1.5 bg-gray-100 dark:bg-gray-800 w-fit h-fit rounded font-bold text-xs sm:text-sm gap-1 sm:gap-2">
            <span className="text-gray-400">APY</span>
            <div className="text-gray-800 dark:text-white">
              {depositApy.toFixed(2)}%
            </div>
          </div>
        </div>
        <ActionButton {...actionButtonProps} />
      </div>
      {!showRiskSidebar ? (
        <div className="hidden lg:inline-flex absolute -z-10 -right-24 top-6 py-2 pl-8 pr-3 gap-1 rounded-lg bg-[#22C55E1A]">
          <button
            className="flex flex-row gap-1"
            onClick={() => setShowRiskSidebar(!showRiskSidebar)}
          >
            <div className="text-sm	font-bold opacity-90 text-green-500">
              Check <br />
              Risk
            </div>
            <div className="flex items-center h-full">
              <RightBracketAngleSvg />
            </div>
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
