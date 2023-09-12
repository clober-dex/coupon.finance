import React from 'react'
import Image from 'next/image'

import { Currency, getLogo } from '../model/currency'
import { useCurrencyContext } from '../contexts/currency-context'
import { formatDollarValue, formatUnits } from '../utils/numbers'

import LeftSvg from './svg/left-svg'
import SearchSvg from './svg/search-svg'

const CurrencySelect = ({
  currencies,
  onBack,
  onCurrencySelect,
}: {
  currencies: Currency[]
  onBack: () => void
  onCurrencySelect: (currency: Currency) => void
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { prices, balances } = useCurrencyContext()
  return (
    <div className="flex flex-col flex-1 p-4 mt-2 sm:mt-0 items-center sm:justify-center">
      <div className="flex flex-col shadow-md bg-gray-50 dark:bg-gray-900 rounded-xl sm:rounded-3xl w-full sm:w-[480px]">
        <div className="flex flex-col p-4 rounded-t-xl sm:rounded-t-3xl gap-4">
          <div className="flex text-sm sm:text-xl font-bold items-center justify-between">
            <button onClick={onBack}>
              <LeftSvg className=" w-4 h-4 sm:w-6 sm:h-6" />
            </button>
            Select a token
            <LeftSvg className="invisible" />
          </div>
          <div className="relative rounded shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchSvg className="h-4 w-4" />
            </div>
            <input
              type="search"
              name="search"
              id="search"
              className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 dark:bg-gray-800 placeholder:text-gray-400 text-xs sm:text-sm"
              placeholder="Search by token name, symbol, or address"
            />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-b-xl sm:rounded-b-3xl">
          {currencies.map((currency) => (
            <button
              key={currency.address}
              className="flex w-full px-4 py-2 items-center justify-between text-start"
              onClick={() => onCurrencySelect(currency)}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={getLogo(currency)}
                  alt={currency.name}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                  height={16}
                  width={16}
                />
                <div>
                  <div className="text-sm sm:text-base font-bold">
                    {currency.symbol}
                  </div>
                  <div className="text-xs text-gray-500">{currency.name}</div>
                </div>
              </div>
              <div className="text-sm text-end">
                <div>
                  {formatUnits(
                    balances[currency.address] ?? 0n,
                    currency.decimals,
                    prices[currency.address],
                  )}
                </div>
                <div className="text-gray-500 text-xs">
                  {formatDollarValue(
                    balances[currency.address] ?? 0n,
                    currency.decimals,
                    prices[currency.address],
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CurrencySelect
