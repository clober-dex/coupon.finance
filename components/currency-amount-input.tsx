import React, { useCallback, useMemo } from 'react'
import { parseUnits } from 'viem'

import { Currency, getLogo } from '../model/currency'
import { BigDecimal, formatDollarValue, formatUnits } from '../utils/numbers'

import NumberInput from './number-input'
import DownSvg from './svg/down-svg'
import { ClientComponent } from './client-component'

const CurrencyAmountInput = ({
  currency,
  value,
  onValueChange,
  balance,
  price,
  onCurrencyClick,
  ...props
}: {
  currency?: Currency
  value: string
  onValueChange: (value: string) => void
  balance: bigint
  price?: BigDecimal
  onCurrencyClick?: () => void
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  const decimals = useMemo(() => currency?.decimals ?? 18, [currency])

  const onBlur = useCallback(() => {
    const amount = parseUnits(value, decimals)
    onValueChange(amount ? formatUnits(amount, decimals) : '')
  }, [decimals, onValueChange, value])

  const onMaxClick = useCallback(() => {
    onValueChange(balance ? formatUnits(balance, currency?.decimals ?? 18) : '')
  }, [balance, currency?.decimals, onValueChange])

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg p-3 gap-2">
      <div className="flex flex-1 justify-between gap-2">
        <NumberInput
          className="flex-1 text-xl sm:text-2xl placeholder-gray-400 outline-none bg-transparent"
          value={value}
          onValueChange={onValueChange}
          onBlur={onBlur}
          placeholder="0.0000"
          {...props}
        />
        {onCurrencyClick ? (
          currency ? (
            <button
              className="flex w-fit items-center rounded-full bg-gray-100 dark:bg-gray-700 py-1 pl-2 pr-3 gap-2"
              onClick={onCurrencyClick}
            >
              <img
                src={getLogo(currency)}
                alt={currency.name}
                className="w-5 h-5"
              />
              <div className="text-sm sm:text-base">{currency.symbol}</div>
            </button>
          ) : (
            <button
              className="flex items-center rounded-full bg-green-500 text-white pl-3 pr-2 py-1 gap-2 text-sm sm:text-base"
              onClick={onCurrencyClick}
            >
              Select token <DownSvg />
            </button>
          )
        ) : currency ? (
          <div className="flex w-fit items-center rounded-full bg-gray-100 dark:bg-gray-700 py-1 pl-2 pr-3 gap-2">
            <img
              src={getLogo(currency)}
              alt={currency.name}
              className="w-5 h-5"
            />
            <div className="text-sm sm:text-base">{currency.symbol}</div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="flex items-end justify-between">
        <ClientComponent className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
          ~{formatDollarValue(parseUnits(value, decimals), decimals, price)}
        </ClientComponent>
        {currency ? (
          <div className="flex text-xs sm:text-sm gap-1 sm:gap-2">
            <div className="text-gray-500">Available</div>
            <ClientComponent>
              {formatUnits(balance, currency.decimals, price)}
            </ClientComponent>
            <button className="text-green-500" onClick={onMaxClick}>
              MAX
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default CurrencyAmountInput
