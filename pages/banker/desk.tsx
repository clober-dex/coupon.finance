import React, { useState } from 'react'
import Head from 'next/head'
import { isAddressEqual } from 'viem'

import { useCurrencyContext } from '../../contexts/currency-context'
import CurrencyAmountInput from '../../components/input/currency-amount-input'
import { Asset } from '../../model/asset'
import { CurrencyIcon } from '../../components/icon/currency-icon'
import DownSvg from '../../components/svg/down-svg'
import { CurrencyDropdown } from '../../components/dropdown/currency-dropdown'
import { Currency } from '../../model/currency'
import { ActionButton } from '../../components/button/action-button'

const Desk = () => {
  const { balances, prices, assets } = useCurrencyContext()

  const [value, setValue] = useState('')
  const [asset, setAsset] = useState<Asset | undefined>(undefined)
  const [substitute, setSubstitute] = useState<Currency | undefined>(undefined)

  console.log('balance', asset ? balances[asset?.underlying.address] ?? 0n : 0n)

  return (
    <div className="flex flex-1">
      <Head>
        <title>The Banker&apos;s Desk</title>
      </Head>
      <main className="flex flex-1 flex-col justify-center items-center">
        <h1 className="flex justify-center text-center font-bold text-3xl sm:text-5xl sm:leading-[48px] mt-8 sm:mt-16 mb-8 sm:mb-16">
          The Banker&apos;s Desk
        </h1>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col bg-white gap-4 dark:bg-gray-900 sm:rounded-3xl p-4 sm:p-6 sm:pb-8 w-full sm:w-[480px]">
            <div className="flex flex-col gap-4">
              <div className="font-bold text-sm sm:text-lg">
                How much do you want to convert?
              </div>
              <CurrencyAmountInput
                value={value}
                onValueChange={setValue}
                currency={asset?.underlying}
                availableAmount={
                  asset ? balances[asset?.underlying.address ?? ''] ?? 0n : 0n
                }
                price={asset ? prices[asset?.underlying.address] : undefined}
              >
                <CurrencyDropdown
                  selectedCurrency={asset?.underlying}
                  currencies={assets.map((asset) => asset.underlying)}
                  onCurrencySelect={(currency) => {
                    const asset = assets.find((asset) =>
                      isAddressEqual(
                        asset.underlying.address,
                        currency.address,
                      ),
                    )
                    setAsset(asset)
                    setSubstitute(asset?.substitutes[0])
                  }}
                >
                  {asset ? (
                    <div className="flex w-fit items-center rounded-full bg-gray-100 dark:bg-gray-700 py-1 pl-2 pr-3 gap-2">
                      <CurrencyIcon
                        currency={asset.underlying}
                        className="w-5 h-5"
                      />
                      <div className="text-sm sm:text-base">
                        {asset.underlying.symbol}
                      </div>
                    </div>
                  ) : (
                    <div className="w-fit flex items-center rounded-full bg-green-500 text-white pl-3 pr-2 py-1 gap-2 text-sm sm:text-base">
                      Select token <DownSvg />
                    </div>
                  )}
                </CurrencyDropdown>
              </CurrencyAmountInput>
              <div></div>
              <div className="font-bold text-sm sm:text-lg">
                Which substitute will you convert to?
              </div>
              <CurrencyAmountInput
                value={value}
                onValueChange={setValue}
                currency={asset?.underlying}
                availableAmount={
                  asset ? balances[asset?.underlying.address] ?? 0n : 0n
                }
                price={asset ? prices[asset?.underlying.address] : undefined}
              >
                <CurrencyDropdown
                  selectedCurrency={substitute}
                  currencies={asset ? asset.substitutes : []}
                  onCurrencySelect={(currency) => {
                    setSubstitute(currency)
                  }}
                >
                  {substitute ? (
                    <div className="flex w-fit items-center rounded-full bg-gray-100 dark:bg-gray-700 py-1 pl-2 pr-3 gap-2">
                      <CurrencyIcon currency={substitute} className="w-5 h-5" />
                      <div className="text-sm sm:text-base">
                        {substitute.symbol}
                      </div>
                    </div>
                  ) : (
                    <div className="w-fit flex items-center rounded-full bg-green-500 text-white pl-3 pr-2 py-1 gap-2 text-sm sm:text-base">
                      Select token <DownSvg />
                    </div>
                  )}
                </CurrencyDropdown>
              </CurrencyAmountInput>
              <ActionButton
                disabled={!asset || !substitute}
                text="Convert"
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Desk
