import React from 'react'

import CurrencyAmountInput from '../input/currency-amount-input'
import { Currency } from '../../model/currency'
import { Prices } from '../../model/prices'
import { ArrowDownSvg } from '../svg/arrow-down-svg'
import DownSvg from '../svg/down-svg'
import { ActionButton, ActionButtonProps } from '../button/action-button'
import { CurrencyIcon } from '../icon/currency-icon'
import { CurrencyDropdown } from '../dropdown/currency-dropdown'

export const SwapForm = ({
  currencies,
  prices,
  inputCurrency,
  setInputCurrency,
  inputCurrencyAmount,
  setInputCurrencyAmount,
  availableInputCurrencyBalance,
  outputCurrency,
  setOutputCurrency,
  outputCurrencyAmount,
  actionButtonProps,
}: {
  currencies: Currency[]
  prices: Prices
  inputCurrency: Currency | undefined
  setInputCurrency: (inputCurrency: Currency | undefined) => void
  inputCurrencyAmount: string
  setInputCurrencyAmount: (inputCurrencyAmount: string) => void
  availableInputCurrencyBalance: bigint
  outputCurrency: Currency | undefined
  setOutputCurrency: (outputCurrency: Currency | undefined) => void
  outputCurrencyAmount: string
  actionButtonProps: ActionButtonProps
}) => {
  return (
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
          disabled={!inputCurrency}
        >
          <CurrencyDropdown
            selectedCurrency={inputCurrency}
            currencies={currencies}
            onCurrencySelect={(currency) => {
              setInputCurrency(currency)
            }}
          >
            {inputCurrency ? (
              <div className="flex w-fit items-center rounded-full bg-gray-100 dark:bg-gray-700 py-1 pl-2 pr-3 gap-2">
                <CurrencyIcon currency={inputCurrency} className="w-5 h-5" />
                <div className="text-sm sm:text-base">
                  {inputCurrency.symbol}
                </div>
              </div>
            ) : (
              <div className="w-fit flex items-center rounded-full bg-green-500 text-white pl-3 pr-2 py-1 gap-2 text-sm sm:text-base">
                Select token <DownSvg />
              </div>
            )}
          </CurrencyDropdown>
        </CurrencyAmountInput>
        <CurrencyAmountInput
          currency={outputCurrency}
          value={outputCurrencyAmount}
          onValueChange={() => {}}
          availableAmount={0n}
          price={outputCurrency ? prices[outputCurrency.address] : undefined}
          disabled={!outputCurrency}
        >
          <CurrencyDropdown
            selectedCurrency={inputCurrency}
            currencies={currencies}
            onCurrencySelect={(currency) => {
              setOutputCurrency(currency)
            }}
          >
            {outputCurrency ? (
              <div className="flex w-fit items-center rounded-full bg-gray-100 dark:bg-gray-700 py-1 pl-2 pr-3 gap-2">
                <CurrencyIcon currency={outputCurrency} className="w-5 h-5" />
                <div className="text-sm sm:text-base">
                  {outputCurrency.symbol}
                </div>
              </div>
            ) : (
              <div className="w-fit flex items-center rounded-full bg-green-500 text-white pl-3 pr-2 py-1 gap-2 text-sm sm:text-base">
                Select token <DownSvg />
              </div>
            )}
          </CurrencyDropdown>
        </CurrencyAmountInput>
        <div className="absolute flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gray-100 dark:bg-gray-900 p-1 sm:p-1.5">
          <button
            className="flex items-center justify-center p-0 bg-gray-100 dark:bg-gray-900 w-full h-full rounded-full transform hover:rotate-180 transition duration-300"
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
