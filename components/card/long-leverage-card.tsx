import React from 'react'
import Link from 'next/link'
import { isAddressEqual } from 'viem'

import { Currency } from '../../model/currency'
import { formatDollarValue } from '../../utils/numbers'
import { CurrencyIcon } from '../icon/currency-icon'
import { Prices } from '../../model/prices'

export const LongLeverageCard = ({
  collateralCurrency,
  debtCurrencies,
  lowestApy,
  maxMultiplier,
  prices,
}: {
  collateralCurrency: Currency
  debtCurrencies: Currency[]
  lowestApy: number
  maxMultiplier: number
  prices: Prices
}) => {
  return (
    <Link href={`/leverage/${collateralCurrency.symbol}_LONG`}>
      <div className="h-[314px] flex flex-col w-full px-4 py-6 justify-center items-center gap-4 bg-white dark:bg-gray-800 rounded-xl">
        <div className="flex flex-col items-start gap-6 self-stretch">
          <div className="flex items-center gap-3 self-stretch">
            <CurrencyIcon
              currency={collateralCurrency}
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <div className="font-bold text-xl sm:text-2xl">
              {collateralCurrency.symbol}
            </div>
            <div className="flex flex-col justify-center items-end ml-auto">
              <div className="text-xs sm:text-sm text-gray-400">As low as</div>
              <div className="text-base sm:text-xl font-bold">
                {!Number.isNaN(lowestApy)
                  ? Number.isFinite(lowestApy)
                    ? `${lowestApy.toFixed(2)}%`
                    : '-'
                  : '-'}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-6 self-stretch">
            <div className="flex flex-col items-start gap-4 self-stretch">
              <div className="flex items-center self-stretch">
                <div className="flex flex-col items-start gap-1 flex-grow flex-shrink-0 basis-0">
                  <div className="text-xs sm:text-sm text-gray-400">
                    Max Multiplier
                  </div>
                  <div className="flex items-baseline gap-1 self-stretch">
                    <span className="text-base sm:text-xl font-bold">
                      {maxMultiplier.toFixed(2)} x
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-xs sm:text-sm text-gray-400">
                    Current Price
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base sm:text-xl font-bold">
                      {formatDollarValue(
                        BigInt(10 ** collateralCurrency.decimals),
                        collateralCurrency.decimals,
                        prices[collateralCurrency.address],
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col item-start gap-3 self-stretch">
                <div className="text-gray-400 text-xs sm:text-sm">
                  Borrow Against
                </div>
                <div className="flex items-start gap-2 self-stretch rounded-lg">
                  {debtCurrencies
                    .filter(
                      (currency) =>
                        !isAddressEqual(
                          currency.address,
                          collateralCurrency.address,
                        ),
                    )
                    .map((currency) => (
                      <React.Fragment key={currency.address}>
                        <CurrencyIcon currency={currency} className="w-6 h-6" />
                      </React.Fragment>
                    ))}
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col items-center justify-center self-stretch bg-green-500 rounded-lg h-12 px-3 py-2 font-bold text-base text-white gap-2 hover:bg-green-400 dark:hover:bg-green-600">
              Leverage
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
