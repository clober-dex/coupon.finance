import React, { useState } from 'react'
import Head from 'next/head'

import { Currency } from '../../model/currency'
import { useCurrencyContext } from '../../contexts/currency-context'
import { SwapForm } from '../../components/form/swap-form'

const Desk = () => {
  const { prices, balances } = useCurrencyContext()
  const [mode, setMode] = useState<'substitute' | 'coupon'>('substitute')
  const [inputCurrency, setInputCurrency] = useState<Currency | undefined>(
    undefined,
  )
  const [inputCurrencyAmount, setInputCurrencyAmount] = useState('')
  const [outputCurrency, setOutputCurrency] = useState<Currency | undefined>(
    undefined,
  )
  const [showInputCurrencySelect, setShowInputCurrencySelect] = useState(false)
  const [showOutputCurrencySelect, setShowOutputCurrencySelect] =
    useState(false)

  // fetch coupon balances

  // fetch substitute balances

  return (
    <div className="flex flex-1">
      <Head>
        <title>The Banker&apos;s Desk</title>
      </Head>
      <main className="flex flex-1 flex-col justify-center items-center">
        <h1 className="flex justify-center text-center font-bold text-3xl sm:text-5xl sm:leading-[48px] mt-8 sm:mt-16">
          The Banker&apos;s Desk
        </h1>

        <div className="flex w-full flex-col items-center gap-4 sm:gap-6 p-4 pb-0">
          <div className="relative flex gap-4 mt-14">
            <button
              className="disabled:text-gray-950 disabled:dark:text-white font-bold pb-1 border-b-2 border-solid disabled:border-b-gray-950 disabled:dark:border-b-white w-24 text-gray-400 dark:text-gray-500 border-b-transparent dark:border-b-transparent"
              onClick={() => {
                setMode('substitute')
              }}
              disabled={'substitute' === mode}
            >
              Substitute
            </button>
            <button
              className="disabled:text-gray-950 disabled:dark:text-white font-bold pb-1 border-b-2 border-solid disabled:border-b-gray-950 disabled:dark:border-b-white w-24 text-gray-400 dark:text-gray-500 border-b-transparent dark:border-b-transparent"
              onClick={() => {
                setMode('coupon')
              }}
              disabled={'coupon' === mode}
            >
              Coupon
            </button>
          </div>
          <div className="flex flex-col w-fit mb-4 sm:mb-6">
            <div className="flex flex-col w-full lg:flex-row gap-4">
              <div className="flex flex-col rounded-2xl p-6 sm:w-[528px] lg:w-[480px]">
                <SwapForm
                  currencies={[]}
                  balances={balances}
                  prices={prices}
                  showInputCurrencySelect={showInputCurrencySelect}
                  setShowInputCurrencySelect={setShowInputCurrencySelect}
                  inputCurrency={inputCurrency}
                  setInputCurrency={setInputCurrency}
                  inputCurrencyAmount={inputCurrencyAmount}
                  setInputCurrencyAmount={setInputCurrencyAmount}
                  availableInputCurrencyBalance={0n}
                  showOutputCurrencySelect={showOutputCurrencySelect}
                  setShowOutputCurrencySelect={setShowOutputCurrencySelect}
                  outputCurrency={outputCurrency}
                  setOutputCurrency={setOutputCurrency}
                  outputCurrencyAmount={''}
                  actionButtonProps={{
                    disabled: true,
                    onClick: async () => {},
                    text:
                      mode === 'substitute'
                        ? 'Convert Substitute'
                        : 'Convert Coupon',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Desk
