import { isAddressEqual } from 'viem'
import React, { useEffect } from 'react'
import { Tooltip } from 'react-tooltip'

import CurrencyAmountInput from '../input/currency-amount-input'
import { formatUnits } from '../../utils/numbers'
import { ActionButton, ActionButtonProps } from '../button/action-button'
import { Currency } from '../../model/currency'
import { Collateral } from '../../model/collateral'
import { Balances } from '../../model/balances'
import { Prices } from '../../model/prices'
import {
  currentTimestampInSeconds,
  getDaysBetweenDates,
  getNextMonthStartTimestamp,
  SECONDS_IN_MONTH,
} from '../../utils/date'
import Slider from '../slider'
import { DotSvg } from '../svg/dot-svg'
import { getLTVTextColor } from '../../utils/ltv'
import DownSvg from '../svg/down-svg'
import { CurrencyDropdown } from '../dropdown/currency-dropdown'
import { CurrencyIcon } from '../icon/currency-icon'
import { QuestionMarkSvg } from '../svg/question-mark-svg'

export const LeverageForm = ({
  borrowCurrency,
  setBorrowCurrency,
  availableBorrowCurrencies,
  interest,
  borrowApy,
  borrowLTV,
  interestsByEpochsBorrowed,
  collateral,
  setCollateral,
  availableCollaterals,
  collateralValue,
  collateralAmount,
  setCollateralValue,
  borrowValue,
  epochs,
  setEpochs,
  multiple,
  setMultiple,
  maxAvailableMultiple,
  balances,
  prices,
  actionButtonProps,
  children,
}: {
  borrowCurrency?: Currency
  setBorrowCurrency: (currency?: Currency) => void
  availableBorrowCurrencies: Currency[]
  interest: bigint
  borrowApy: number
  borrowLTV: number
  interestsByEpochsBorrowed?: { date: string; apy: number }[]
  collateral?: Collateral
  setCollateral: (collateral?: Collateral) => void
  availableCollaterals: Collateral[]
  collateralValue: string
  collateralAmount: bigint
  setCollateralValue: (value: string) => void
  borrowValue: string
  epochs: number
  setEpochs: (value: number) => void
  multiple: number
  setMultiple: (value: number) => void
  maxAvailableMultiple: number
  balances: Balances
  prices: Prices
  actionButtonProps: ActionButtonProps
} & React.PropsWithChildren) => {
  const currentTimestamp = currentTimestampInSeconds()
  const leftMonthInSecond =
    getNextMonthStartTimestamp(currentTimestamp) - currentTimestamp
  const minPosition =
    (leftMonthInSecond /
      (leftMonthInSecond +
        SECONDS_IN_MONTH *
          (interestsByEpochsBorrowed ? interestsByEpochsBorrowed.length : 1))) *
    100

  useEffect(() => {
    if (availableBorrowCurrencies.length === 1) {
      setBorrowCurrency(availableBorrowCurrencies[0])
    }
  }, [availableBorrowCurrencies, setBorrowCurrency])

  useEffect(() => {
    if (availableCollaterals.length === 1) {
      setCollateral(availableCollaterals[0])
    }
  }, [availableCollaterals, setCollateral])

  useEffect(() => {
    if (!collateral) {
      const usdcCurrency = availableCollaterals.find(
        (collateral) => collateral.underlying.symbol === 'USDC',
      )
      if (usdcCurrency) {
        setCollateral(usdcCurrency)
      }
    }
  }, [availableCollaterals, collateral, setCollateral])

  useEffect(() => {
    if (!borrowCurrency) {
      const usdcCurrency = availableBorrowCurrencies.find(
        (currency) => currency.symbol === 'USDC',
      )
      if (usdcCurrency) {
        setBorrowCurrency(usdcCurrency)
      }
    }
  }, [availableBorrowCurrencies, borrowCurrency, setBorrowCurrency])

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`flex flex-col bg-white gap-4 dark:bg-gray-900 sm:rounded-3xl p-4 sm:p-6 sm:pb-8 w-full sm:w-[480px]`}
      >
        <div className="flex flex-col gap-4">
          <div className="font-bold text-sm sm:text-lg">
            How much collateral would you like to add?
          </div>
          <CurrencyAmountInput
            currency={collateral?.underlying}
            value={collateralValue}
            onValueChange={setCollateralValue}
            availableAmount={
              collateral ? balances[collateral?.underlying.address] ?? 0n : 0n
            }
            price={
              collateral ? prices[collateral?.underlying.address] : undefined
            }
            disabled={!collateral}
          >
            {!collateral || availableCollaterals.length > 1 ? (
              <CurrencyDropdown
                selectedCurrency={collateral?.underlying}
                currencies={
                  availableCollaterals.map(
                    (collateral) => collateral.underlying,
                  ) ?? []
                }
                onCurrencySelect={(currency) => {
                  const collateral = availableCollaterals.find((collateral) =>
                    isAddressEqual(
                      collateral.underlying.address,
                      currency.address,
                    ),
                  )
                  setCollateral(collateral)
                }}
              >
                {collateral ? (
                  <div className="flex w-fit items-center rounded-full bg-gray-100 dark:bg-gray-700 py-1 pl-2 pr-3 gap-2">
                    <CurrencyIcon
                      currency={collateral.underlying}
                      className="w-5 h-5"
                    />
                    <div className="text-sm sm:text-base">
                      {collateral.underlying.symbol}
                    </div>
                    <DownSvg className="stroke-gray-950 dark:stroke-white" />
                  </div>
                ) : (
                  <div className="w-fit flex items-center rounded-full bg-green-500 text-white pl-3 pr-2 py-1 gap-2 text-sm sm:text-base">
                    Select token <DownSvg />
                  </div>
                )}
              </CurrencyDropdown>
            ) : undefined}
          </CurrencyAmountInput>
          {collateral ? <div className="flex ml-auto">{children}</div> : <></>}
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex items-end self-stretch">
            <span className="font-bold text-sm sm:text-lg">Set multiple.</span>
            <span className="ml-auto text-xs sm:text-sm text-gray-400 font-semibold">
              Max {maxAvailableMultiple.toFixed(2)} x
            </span>
          </div>
          <div className="flex justify-between flex-col relative bg-white dark:bg-gray-900 rounded-lg pb-4 h-[70px]">
            <div className="sm:px-6 sm:mb-2 mr-4 sm:mr-0">
              <div>
                <Slider
                  minPosition={0}
                  segments={(maxAvailableMultiple - 1) * 100 + 1}
                  value={borrowCurrency ? (multiple - 1) * 100 : 0}
                  onValueChange={
                    borrowCurrency
                      ? (value) => setMultiple(value / 100 + 1)
                      : () => {}
                    // value is 0-based
                  }
                  disabled={!borrowCurrency}
                  renderControl={() => (
                    <div className="absolute -top-3 -left-7 flex flex-col items-center gap-2 shrink-0">
                      <DotSvg />
                      <div className="flex px-2 py-1 justify-center w-[60px] items-center gap-1 rounded-2xl bg-green-500 bg-opacity-10 text-xs text-green-500 font-bold">
                        {multiple.toFixed(2)} x
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="font-bold text-sm sm:text-lg">
            Which token you’d like to borrow?
          </div>
          <CurrencyAmountInput
            currency={borrowCurrency}
            value={borrowValue}
            onValueChange={() => {}}
            price={borrowCurrency ? prices[borrowCurrency.address] : undefined}
            availableAmount={0n}
            disabled={true}
          >
            {!borrowCurrency || availableBorrowCurrencies.length > 1 ? (
              <CurrencyDropdown
                selectedCurrency={borrowCurrency}
                currencies={availableBorrowCurrencies}
                onCurrencySelect={(currency) => {
                  setBorrowCurrency(
                    availableBorrowCurrencies.find((c) =>
                      isAddressEqual(c.address, currency.address),
                    ),
                  )
                }}
              >
                {borrowCurrency ? (
                  <div className="flex w-fit items-center rounded-full bg-gray-100 dark:bg-gray-700 py-1 pl-2 pr-3 gap-2">
                    <CurrencyIcon
                      currency={borrowCurrency}
                      className="w-5 h-5"
                    />
                    <div className="text-sm sm:text-base">
                      {borrowCurrency.symbol}
                    </div>
                    <DownSvg className="stroke-gray-950 dark:stroke-white" />
                  </div>
                ) : (
                  <div className="w-fit flex items-center rounded-full bg-green-500 text-white pl-3 pr-2 py-1 gap-2 text-sm sm:text-base">
                    Select token <DownSvg />
                  </div>
                )}
              </CurrencyDropdown>
            ) : undefined}
          </CurrencyAmountInput>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="font-bold text-sm sm:text-lg">
              How long you’d like to secure your loan?
            </div>
            <div className="text-gray-500 text-xs sm:text-sm">
              You can withdraw before expiry by buying back coupons.
            </div>
          </div>
          <div className="flex justify-between flex-col relative bg-white dark:bg-gray-900 rounded-lg p-4 pb-8 sm:pb-0 sm:h-[90px]">
            {interestsByEpochsBorrowed === undefined ||
            interestsByEpochsBorrowed.length === 0 ? (
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
                    segments={interestsByEpochsBorrowed?.length ?? 0}
                    value={epochs}
                    onValueChange={setEpochs}
                    renderControl={() => (
                      <div className="flex w-[110px] flex-col items-center gap-2 shrink-0">
                        <div className="flex px-2 py-1 justify-center items-center gap-1 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-white text-xs font-bold">
                          {getDaysBetweenDates(
                            new Date(interestsByEpochsBorrowed[epochs].date),
                            new Date(currentTimestamp * 1000),
                          )}{' '}
                          Days
                        </div>
                        <DotSvg />
                        <div className="flex px-2 py-1 justify-center items-center gap-1 rounded-2xl bg-green-500 bg-opacity-10 text-xs text-green-500 font-bold">
                          {interestsByEpochsBorrowed[epochs].date}
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
          <div className="text-lg font-bold">Transaction Overview</div>
          <div className="flex flex-col items-start gap-3 self-stretch">
            <div className="flex w-full">
              <div className="text-gray-400 text-base">Interest</div>
              <div className="flex ml-auto">
                {borrowCurrency
                  ? `${formatUnits(
                      interest,
                      borrowCurrency.decimals,
                      prices[borrowCurrency.address],
                    )} ${borrowCurrency.symbol}`
                  : '0'}
              </div>
            </div>
            <div className="flex w-full">
              <div className="text-gray-400 text-base">APY</div>
              <div className="flex ml-auto">
                {Number.isNaN(borrowApy) ? 0 : borrowApy.toFixed(2)}%
              </div>
            </div>
            <div className="flex w-full">
              <div className="text-gray-400 text-base">LTV</div>
              <div
                className={`ml-auto ${
                  collateral ? getLTVTextColor(borrowLTV, collateral) : ''
                }`}
              >
                {borrowLTV.toFixed(2)}%
              </div>
            </div>
            <div className="flex w-full">
              <div className="text-gray-400 text-base">Liquidation LTV</div>
              <div className="ml-auto">
                {collateral
                  ? Number(
                      (collateral.liquidationThreshold * 100n) /
                        collateral.ltvPrecision,
                    ).toFixed(2)
                  : 0}
                %
              </div>
            </div>
            {collateral ? (
              <div className="flex w-full">
                <div className="text-gray-400 text-base">
                  Collateral position
                </div>
                <div className="ml-auto">
                  {Number.isNaN(parseFloat(collateralValue))
                    ? 0
                    : formatUnits(
                        collateralAmount,
                        collateral.underlying.decimals,
                        prices[collateral.underlying.address],
                      )}{' '}
                  {collateral.underlying.symbol}
                </div>
              </div>
            ) : (
              <></>
            )}
            {interestsByEpochsBorrowed &&
            interestsByEpochsBorrowed.length > 0 ? (
              <div className="flex w-full">
                <div className="flex flex-row items-center justify-center gap-1 text-gray-400 text-base">
                  Expired Date (UTC)
                  <QuestionMarkSvg
                    data-tooltip-id="expiry-date-tooltip"
                    data-tooltip-content="The position will be liquidated if not repaid by this date."
                  />
                  <Tooltip id="expiry-date-tooltip" />
                </div>
                <div className="ml-auto">
                  {interestsByEpochsBorrowed[epochs].date}
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
  )
}
