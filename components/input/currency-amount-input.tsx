import React, { useCallback, useMemo } from 'react'

import { Currency } from '../../model/currency'
import {
  BigDecimal,
  formatDollarValue,
  formatUnits,
  parseUnits,
} from '../../utils/numbers'
import { CurrencyIcon } from '../icon/currency-icon'

import NumberInput from './number-input'

const CurrencyAmountInput = ({
  currency,
  value,
  onValueChange,
  availableAmount,
  price,
  children,
  ...props
}: {
  currency?: Currency
  value: string
  onValueChange: (value: string) => void
  availableAmount: bigint
  price?: BigDecimal
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> &
  React.PropsWithChildren) => {
  const decimals = useMemo(() => currency?.decimals ?? 18, [currency])

  const onBlur = useCallback(() => {
    const amount = parseUnits(value, decimals)
    onValueChange(amount ? formatUnits(amount, decimals) : '')
  }, [decimals, onValueChange, value])

  const onMaxClick = useCallback(() => {
    onValueChange(
      availableAmount
        ? formatUnits(availableAmount, currency?.decimals ?? 18)
        : '',
    )
  }, [availableAmount, currency?.decimals, onValueChange])

  return (
    <div
      className={`flex flex-col ${
        props.disabled
          ? 'bg-gray-50 dark:bg-gray-800'
          : 'bg-white dark:bg-gray-900 hover:ring-2'
      } p-3 gap-2 rounded-xl ring-1 ring-gray-300 dark:ring-gray-600`}
    >
      <div className="flex flex-1 justify-between gap-2">
        <NumberInput
          className={`w-full flex-1 text-xl sm:text-2xl ${
            props.disabled ? 'text-gray-400' : ''
          } placeholder-gray-400 outline-none bg-transparent`}
          value={value}
          onValueChange={onValueChange}
          onBlur={onBlur}
          placeholder="0.0000"
          {...props}
        />
        {children ? (
          children
        ) : currency ? (
          <div className="flex w-fit items-center rounded-full bg-gray-100 dark:bg-gray-700 py-1 pl-2 pr-3 gap-2">
            <CurrencyIcon currency={currency} className="w-5 h-5" />
            <div className="text-sm sm:text-base">{currency.symbol}</div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="flex items-end justify-between">
        <div className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
          ~{formatDollarValue(parseUnits(value, decimals), decimals, price)}
        </div>
        {!props.disabled && currency ? (
          <div className="flex text-xs sm:text-sm gap-1 sm:gap-2">
            <div className="text-gray-500">Available</div>
            <div>{formatUnits(availableAmount, currency.decimals, price)}</div>
            {availableAmount > 0n ? (
              <button className="text-green-500" onClick={onMaxClick}>
                MAX
              </button>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default CurrencyAmountInput
