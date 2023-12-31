import React from 'react'
import { getAddress, isAddress, isAddressEqual } from 'viem'

import { Currency } from '../../model/currency'
import { formatDollarValue, formatUnits } from '../../utils/numbers'
import { Balances } from '../../model/balances'
import { Prices } from '../../model/prices'
import LeftSvg from '../svg/left-svg'
import SearchSvg from '../svg/search-svg'
import { CurrencyIcon } from '../icon/currency-icon'

const CurrencySelect = ({
  currencies,
  onBack,
  onCurrencySelect,
  prices,
  balances,
}: {
  currencies: Currency[]
  onBack: () => void
  onCurrencySelect: (currency: Currency) => void
  balances: Balances
  prices: Prices
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [value, setValue] = React.useState('')
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center">
        <div className="w-6 h-6 cursor-pointer relative" onClick={onBack}>
          <LeftSvg />
        </div>
        <div className="flex flex-1 items-center justify-center text-base sm:text-xl font-bold">
          Select a token
        </div>
      </div>
      <div className="flex flex-col relative rounded shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <div className="relative h-4 w-4">
            <SearchSvg />
          </div>
        </div>
        <div className="inline-block">
          <div className="invisible h-0 mx-[29px]" aria-hidden="true">
            Search by token name, symbol, or address
          </div>
          <input
            type="search"
            name="search"
            id="search"
            className="inline w-full rounded-md border-0 pl-10 pr-2 py-3 dark:bg-gray-800 placeholder:text-gray-400 text-xs sm:text-sm"
            placeholder="Search by token name, symbol, or address"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col h-56 overflow-y-auto bg-white dark:bg-gray-900 rounded-b-xl sm:rounded-b-3xl">
        {currencies
          .filter(
            (currency) =>
              (isAddress(value) &&
                isAddressEqual(currency.address, getAddress(value))) ||
              currency.name.toLowerCase().includes(value.toLowerCase()) ||
              currency.symbol.toLowerCase().includes(value.toLowerCase()),
          )
          .sort((a, b) => {
            const aValue =
              Number(balances[a.address] ?? 0n) *
              (prices[a.address]
                ? Number(
                    formatUnits(
                      prices[a.address].value,
                      prices[a.address].decimals,
                    ),
                  )
                : 0.00000001)
            const bValue =
              Number(balances[b.address] ?? 0n) *
              (prices[b.address]
                ? Number(
                    formatUnits(
                      prices[b.address].value,
                      prices[b.address].decimals,
                    ),
                  )
                : 0.00000001)
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
          })
          .map((currency) => (
            <button
              key={currency.address}
              className="flex w-full px-4 py-2 items-center justify-between text-start"
              onClick={() => onCurrencySelect(currency)}
            >
              <div className="flex items-center gap-3">
                <CurrencyIcon
                  currency={currency}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
                <div>
                  <div className="text-sm sm:text-base font-bold">
                    {currency.symbol}
                  </div>
                  <div className="text-xs text-gray-500">{currency.name}</div>
                </div>
              </div>
              <div className="flex-1 text-sm text-end">
                <div>
                  {formatUnits(
                    balances[currency.address] ?? 0n,
                    currency.decimals,
                    prices[currency.address] ?? 0,
                  )}
                </div>
                {prices[currency.address] ? (
                  <div className="text-gray-500 text-xs">
                    {formatDollarValue(
                      balances[currency.address] ?? 0n,
                      currency.decimals,
                      prices[currency.address] ?? 0,
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </button>
          ))}
      </div>
    </div>
  )
}

export default CurrencySelect
