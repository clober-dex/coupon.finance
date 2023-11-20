import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { isAddressEqual } from 'viem'

import CurrencyAmountInput from '../input/currency-amount-input'
import { Currency } from '../../model/currency'
import { Prices } from '../../model/prices'
import { ArrowDownSvg } from '../svg/arrow-down-svg'
import DownSvg from '../svg/down-svg'
import { ActionButton, ActionButtonProps } from '../button/action-button'
import { CurrencyIcon } from '../icon/currency-icon'
import { GasSvg } from '../svg/gas-svg'
import SlippageSelect from '../selector/slippage-select'
import { formatUnits, parseUnits, toPlacesString } from '../../utils/numbers'
import CurrencySelect from '../selector/currency-select'
import { Balances } from '../../model/balances'

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
  showSlippageSelect,
  setShowSlippageSelect,
  slippage,
  setSlippage,
  gasEstimateValue,
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
  showSlippageSelect?: boolean
  setShowSlippageSelect?: React.Dispatch<React.SetStateAction<boolean>>
  slippage?: string
  setSlippage?: React.Dispatch<React.SetStateAction<string>>
  gasEstimateValue?: number
  actionButtonProps: ActionButtonProps
}) => {
  const exchangeRate =
    !new BigNumber(inputCurrencyAmount).isNaN() &&
    !new BigNumber(outputCurrencyAmount).isNaN()
      ? new BigNumber(outputCurrencyAmount).dividedBy(
          new BigNumber(inputCurrencyAmount),
        )
      : new BigNumber(0)
  const isLoadingResults = useMemo(() => {
    return !!(
      inputCurrency &&
      outputCurrency &&
      parseUnits(inputCurrencyAmount, inputCurrency?.decimals ?? 18) > 0n &&
      parseUnits(outputCurrencyAmount, outputCurrency?.decimals ?? 18) === 0n
    )
  }, [inputCurrency, inputCurrencyAmount, outputCurrency, outputCurrencyAmount])

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
          availableAmount={availableInputCurrencyBalance}
          price={inputCurrency ? prices[inputCurrency.address] : undefined}
          disabled={!inputCurrency}
        >
          {inputCurrency ? (
            <div className="flex w-fit items-center rounded-full bg-gray-100 dark:bg-gray-700 py-1 pl-2 pr-3 gap-2">
              <CurrencyIcon currency={inputCurrency} className="w-5 h-5" />
              <div className="text-sm sm:text-base">{inputCurrency.symbol}</div>
            </div>
          ) : (
            <button
              onClick={() => setShowInputCurrencySelect(true)}
              className="w-fit flex items-center rounded-full bg-green-500 text-white pl-3 pr-2 py-1 gap-2 text-sm sm:text-base"
            >
              Select token <DownSvg />
            </button>
          )}
        </CurrencyAmountInput>
        <CurrencyAmountInput
          currency={outputCurrency}
          value={outputCurrencyAmount}
          onValueChange={() => {}}
          availableAmount={0n}
          price={outputCurrency ? prices[outputCurrency.address] : undefined}
          disabled={!outputCurrency}
        >
          {outputCurrency ? (
            <div className="flex w-fit items-center rounded-full bg-gray-100 dark:bg-gray-700 py-1 pl-2 pr-3 gap-2">
              <CurrencyIcon currency={outputCurrency} className="w-5 h-5" />
              <div className="text-sm sm:text-base">
                {outputCurrency.symbol}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowOutputCurrencySelect(true)}
              className="w-fit flex items-center rounded-full bg-green-500 text-white pl-3 pr-2 py-1 gap-2 text-sm sm:text-base"
            >
              Select token <DownSvg />
            </button>
          )}
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
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex text-xs sm:text-sm">
            1 {inputCurrency?.symbol ?? 'IN'} ={'  '}
            {isLoadingResults ? (
              <span className="w-[100px] mx-1 rounded animate-pulse bg-gray-500" />
            ) : (
              <>
                {exchangeRate ? toPlacesString(exchangeRate) : '? '}
                {'  '}
                {outputCurrency?.symbol ?? 'OUT'}
                <span className="text-gray-500">
                  (~$
                  {toPlacesString(
                    exchangeRate &&
                      outputCurrency &&
                      prices[outputCurrency.address]
                      ? exchangeRate.multipliedBy(
                          formatUnits(
                            prices[outputCurrency.address].value,
                            prices[outputCurrency.address].decimals,
                          ) ?? 0,
                        )
                      : 0,
                    2,
                  )}
                  )
                </span>
              </>
            )}
          </div>
          {gasEstimateValue !== undefined ? (
            <div className="flex relative items-center text-xs sm:text-sm">
              <div className="flex items-center h-full mr-0.5">
                <GasSvg />
              </div>
              {isLoadingResults ? (
                <span className="w-[50px] h-[20px] mx-1 rounded animate-pulse bg-gray-500" />
              ) : (
                <div className="flex text-xs sm:text-sm">
                  ${toPlacesString(gasEstimateValue, 2)}
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
        {showSlippageSelect !== undefined &&
        setShowSlippageSelect &&
        slippage !== undefined &&
        setSlippage ? (
          <SlippageSelect
            show={showSlippageSelect}
            setShow={setShowSlippageSelect}
            slippage={slippage}
            setSlippage={setSlippage}
          />
        ) : (
          <></>
        )}
        <ActionButton {...actionButtonProps} />
      </div>
    </>
  )
}
