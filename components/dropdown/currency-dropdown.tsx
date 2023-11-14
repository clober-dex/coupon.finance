import React from 'react'
import Image from 'next/image'
import { CheckIcon } from '@heroicons/react/20/solid'
import { isAddressEqual } from 'viem'

import { Currency, getLogo } from '../../model/currency'
import useDropdown from '../../hooks/useDropdown'

export const CurrencyDropdown = ({
  selectedCurrency,
  currencies,
  onCurrencySelect,
  children,
}: {
  selectedCurrency?: Currency
  currencies: Currency[]
  onCurrencySelect: (currency: Currency) => void
} & React.PropsWithChildren) => {
  const { showDropdown, setShowDropdown } = useDropdown()
  return (
    <div className="flex flex-col relative">
      <button onClick={() => setShowDropdown((showDropdown) => !showDropdown)}>
        {children}
      </button>
      <div className="relative">
        {showDropdown ? (
          <div className="absolute rounded-xl hover:rounded-xl items-start flex flex-col top-2 sm:top-3 right-0 bg-white dark:bg-gray-800 shadow-xl">
            {currencies.map((currency) => (
              <div
                key={currency.address}
                className="flex items-center w-[140px] px-3 py-2 gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex-grow shrink-0 basis-0 first:rounded-t-xl last:rounded-b-xl"
                onClick={() => {
                  onCurrencySelect(currency)
                  setShowDropdown(false)
                }}
              >
                <div className="w-6 h-6 relative">
                  <Image src={getLogo(currency)} alt={currency.name} fill />
                </div>
                <span>{currency.symbol}</span>
                {selectedCurrency &&
                isAddressEqual(currency.address, selectedCurrency.address) ? (
                  <CheckIcon className="ml-auto h-5 w-5" aria-hidden="true" />
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
