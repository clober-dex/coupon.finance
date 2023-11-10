import { isAddressEqual } from 'viem'
import React from 'react'

import CurrencySelect from '../selector/currency-select'
import CurrencyAmountInput from '../input/currency-amount-input'
import Slider from '../slider'
import { formatUnits } from '../../utils/numbers'
import { ActionButton, ActionButtonProps } from '../button/action-button'
import { Currency } from '../../model/currency'
import { Collateral } from '../../model/collateral'
import { Balances } from '../../model/balances'
import { Prices } from '../../model/prices'

export const BorrowForm = ({
  borrowCurrency,
  availableCollaterals,
  maxBorrowAmount,
  interest,
  borrowApy,
  borrowLTV,
  interestsByEpochsBorrowed,
  showCollateralSelect,
  setShowCollateralSelect,
  collateral,
  setCollateral,
  collateralValue,
  setCollateralValue,
  borrowValue,
  setBorrowValue,
  epochs,
  setEpochs,
  balances,
  prices,
  actionButtonProps,
}: {
  borrowCurrency: Currency
  availableCollaterals: Collateral[]
  maxBorrowAmount: bigint
  interest: bigint
  borrowApy: number
  borrowLTV: number
  interestsByEpochsBorrowed?: { date: string; apy: number }[]
  showCollateralSelect: boolean
  setShowCollateralSelect: (show: boolean) => void
  collateral?: Collateral
  setCollateral: (collateral?: Collateral) => void
  collateralValue: string
  setCollateralValue: (value: string) => void
  borrowValue: string
  setBorrowValue: (value: string) => void
  epochs: number
  setEpochs: (value: number) => void
  balances: Balances
  prices: Prices
  actionButtonProps: ActionButtonProps
}) => {
  return showCollateralSelect ? (
    <CurrencySelect
      currencies={availableCollaterals
        .filter(
          ({ underlying }) =>
            !isAddressEqual(underlying.address, borrowCurrency.address),
        )
        .map((collateral) => collateral.underlying)}
      onBack={() => setShowCollateralSelect(false)}
      onCurrencySelect={(currency) => {
        setCollateral(
          availableCollaterals.find(({ underlying }) => {
            return isAddressEqual(underlying.address, currency.address)
          }),
        )
        setShowCollateralSelect(false)
      }}
      prices={prices}
      balances={balances}
    />
  ) : (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col bg-white gap-4 dark:bg-gray-950 sm:dark:bg-gray-900 sm:rounded-3xl p-4 sm:p-6 sm:pb-8 w-full sm:w-[480px]">
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
            onCurrencyClick={() => setShowCollateralSelect(true)}
            disabled={!collateral}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="font-bold text-sm sm:text-lg">
            Select expiration date.
          </div>
          <div className="flex flex-row-reverse justify-between sm:flex-col relative bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="sm:px-6 sm:mb-2">
              <div>
                <Slider
                  length={interestsByEpochsBorrowed?.length ?? 0}
                  value={epochs}
                  onValueChange={setEpochs}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between">
              {(interestsByEpochsBorrowed || []).map(({ date }, index) => (
                <button
                  key={index}
                  className="flex sm:flex-col items-center gap-1 sm:gap-2"
                  onClick={() => setEpochs(index + 1)}
                >
                  <div className="text-sm w-24 sm:w-fit text-start">{date}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="font-bold text-sm sm:text-lg">
            How much would you like to borrow?
          </div>
          <CurrencyAmountInput
            currency={borrowCurrency}
            value={borrowValue}
            onValueChange={setBorrowValue}
            price={prices[borrowCurrency.address]}
            availableAmount={maxBorrowAmount}
            disabled={!collateral || epochs === 0}
          />
        </div>
      </div>
      <div className="flex flex-col bg-white gap-6 dark:bg-gray-950 sm:dark:bg-gray-900 sm:rounded-3xl p-4 sm:p-6 w-full sm:w-[480px]">
        <div className="flex flex-col items-start gap-6 self-stretch">
          <div className="text-lg font-bold">Transaction Overview</div>
          <div className="flex flex-col items-start gap-3 self-stretch">
            <div className="flex w-full">
              <div className="text-gray-400 text-base">Interest</div>
              <div className="flex ml-auto">
                {formatUnits(
                  interest,
                  borrowCurrency.decimals,
                  prices[borrowCurrency.address],
                )}{' '}
                {borrowCurrency.symbol}
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
              <div className="ml-auto">{borrowLTV.toFixed(2)}%</div>
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
          </div>
        </div>
        <ActionButton {...actionButtonProps} />
      </div>
    </div>
  )
}
