import React from 'react'
import { isAddressEqual } from 'viem'

import CurrencyAmountInput from '../input/currency-amount-input'
import { Currency } from '../../model/currency'
import CurrencySelect from '../selector/currency-select'
import { Balances } from '../../model/balances'
import { Prices } from '../../model/prices'
import { ArrowDownSvg } from '../svg/arrow-down-svg'
import DownSvg from '../svg/down-svg'
import { ActionButton, ActionButtonProps } from '../button/action-button'

export const SwapForm = ({
  currencies,
  balances,
  prices,
  showInputCurrencySelect,
  setShowInputCurrencySelect,
  inputCurrency,
  setInputCurrency,
  inputCurrencyAmount,
  setInputCurrencyAmount,
  availableInputCurrencyBalance,
  showOutputCurrencySelect,
  setShowOutputCurrencySelect,
  outputCurrency,
  setOutputCurrency,
  outputCurrencyAmount,
  actionButtonProps,
}: {
  currencies: Currency[]
  balances: Balances
  prices: Prices
  showInputCurrencySelect: boolean
  setShowInputCurrencySelect: (showInputCurrencySelect: boolean) => void
  inputCurrency: Currency | undefined
  setInputCurrency: (inputCurrency: Currency | undefined) => void
  inputCurrencyAmount: string
  setInputCurrencyAmount: (inputCurrencyAmount: string) => void
  availableInputCurrencyBalance: bigint
  showOutputCurrencySelect: boolean
  setShowOutputCurrencySelect: (showOutputCurrencySelect: boolean) => void
  outputCurrency: Currency | undefined
  setOutputCurrency: (outputCurrency: Currency | undefined) => void
  outputCurrencyAmount: string
  actionButtonProps: ActionButtonProps
}) => {
  return showInputCurrencySelect ? (
    <CurrencySelect
      currencies={
        outputCurrency
          ? currencies.filter(
              (currency) =>
                !isAddressEqual(currency.address, outputCurrency.address),
            )
          : currencies
      }
      balances={balances}
      prices={prices}
      onBack={() => setShowInputCurrencySelect(false)}
      onCurrencySelect={(currency) => {
        setInputCurrency(currency)
        setShowInputCurrencySelect(false)
      }}
    />
  ) : showOutputCurrencySelect ? (
    <CurrencySelect
      currencies={
        inputCurrency
          ? currencies.filter(
              (currency) =>
                !isAddressEqual(currency.address, inputCurrency.address),
            )
          : currencies
      }
      balances={balances}
      prices={prices}
      onBack={() => setShowOutputCurrencySelect(false)}
      onCurrencySelect={(currency) => {
        setOutputCurrency(currency)
        setShowOutputCurrencySelect(false)
      }}
    />
  ) : (
    <>
      <div className="flex flex-col relative gap-2 sm:gap-4 mb-3 sm:mb-4">
        <CurrencyAmountInput
          currency={inputCurrency}
          value={inputCurrencyAmount}
          onValueChange={setInputCurrencyAmount}
          availableAmount={BigInt(
            Math.floor(Number(availableInputCurrencyBalance) * 0.997),
          )}
          price={inputCurrency ? prices[inputCurrency.address] : undefined}
        >
          <button
            onClick={() => {
              setShowInputCurrencySelect(true)
            }}
            className="w-fit flex items-center rounded-full bg-green-500 text-white pl-3 pr-2 py-1 gap-2 text-sm sm:text-base"
          >
            Select token <DownSvg />
          </button>
        </CurrencyAmountInput>
        <CurrencyAmountInput
          currency={outputCurrency}
          value={outputCurrencyAmount}
          onValueChange={() => {}}
          availableAmount={0n}
          price={outputCurrency ? prices[outputCurrency.address] : undefined}
          disabled={true}
        >
          <button
            onClick={() => {
              setShowOutputCurrencySelect(true)
            }}
            className="w-fit flex items-center rounded-full bg-green-500 text-white pl-3 pr-2 py-1 gap-2 text-sm sm:text-base"
          >
            Select token <DownSvg />
          </button>
        </CurrencyAmountInput>
        <div className="absolute flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gray-100 dark:bg-gray-900 p-1 sm:p-1.5">
          <button
            className="flex items-center justify-center p-0 bg-gray-100 dark:bg-gray-700 w-full h-full rounded-full transform hover:rotate-180 transition duration-300"
            onClick={() => {
              const prevInputCurrency = inputCurrency
              setInputCurrency(outputCurrency)
              setOutputCurrency(prevInputCurrency)
              setInputCurrencyAmount('')
            }}
          >
            <ArrowDownSvg className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
      <ActionButton {...actionButtonProps} />
    </>
  )
}
