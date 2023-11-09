import React, { useCallback, useMemo } from 'react'
import { parseUnits } from 'viem'
import Image from 'next/image'

import { Currency, getLogo } from '../../model/currency'
import { BigDecimal, formatDollarValue, formatUnits } from '../../utils/numbers'
import DownSvg from '../svg/down-svg'

import NumberInput from './number-input'

const CurrencyAmountInput = ({
  currency,
  value,
  onValueChange,
  availableAmount,
  price,
  onCurrencyClick,
  ...props
}: {
  currency?: Currency
  value: string
  onValueChange: (value: string) => void
  availableAmount: bigint
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
    onValueChange(
      availableAmount
        ? formatUnits(availableAmount, currency?.decimals ?? 18)
        : '',
    )
  }, [availableAmount, currency?.decimals, onValueChange])

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 p-3 gap-2 rounded-xl ring-0 hover:ring-2 ring-gray-300 dark:ring-gray-600">
      <div className="flex flex-1 justify-between gap-2">
        <NumberInput
          className="w-full flex-1 text-xl sm:text-2xl placeholder-gray-400 outline-none bg-transparent"
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
              <div className="w-5 h-5 relative">
                <Image src={getLogo(currency)} alt={currency.name} fill />
              </div>
              <div className="text-sm sm:text-base">{currency.symbol}</div>
            </button>
          ) : (
            <button
              className="w-fit flex items-center rounded-full bg-green-500 text-white pl-3 pr-2 py-1 gap-2 text-sm sm:text-base"
              onClick={onCurrencyClick}
            >
              Select token <DownSvg />
            </button>
          )
        ) : currency ? (
          <div className="flex w-fit items-center rounded-full bg-gray-100 dark:bg-gray-700 py-1 pl-2 pr-3 gap-2">
            <div className="w-5 h-5 relative">
              <Image src={getLogo(currency)} alt={currency.name} fill />
            </div>
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
