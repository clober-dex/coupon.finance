import React from 'react'
import Link from 'next/link'
import { isAddressEqual } from 'viem'

import { Currency } from '../../model/currency'
import { formatDollarValue } from '../../utils/numbers'
import { CurrencyIcon } from '../icon/currency-icon'
import { Prices } from '../../model/prices'
import { MAX_VISIBLE_MARKETS } from '../../utils/market'

export const LongLeverageCard = ({
  collateralCurrency,
  debtCurrencies,
  apys,
  maxMultipliers,
  prices,
}: {
  collateralCurrency: Currency
  debtCurrencies: Currency[]
  apys: { [address: `0x${string}`]: number }
  maxMultipliers: { [address: `0x${string}`]: number }
  prices: Prices
}) => {
  const lowestApy = Math.min(
    ...Object.values(apys).filter((apy) => !Number.isNaN(apy)),
  )
  const maxMultiplier = Math.max(
    ...Object.values(maxMultipliers).filter(
      (multiplier) => !Number.isNaN(multiplier),
    ),
  )
  return (
    <Link
      href={
        debtCurrencies.length === 1
          ? `/leverage/${collateralCurrency.symbol}_${debtCurrencies[0].symbol}`
          : `/leverage/${collateralCurrency.symbol}_LONG`
      }
    >
      <div
        className={`relative h-[310px] ${
          debtCurrencies.length === 1 ? '' : 'group '
        } flex flex-col w-full px-4 py-6 items-center gap-4 bg-white dark:bg-gray-800 rounded-xl`}
      >
        <div className="flex flex-col items-start gap-6 self-stretch">
          <div className="flex items-center gap-3 self-stretch">
            <CurrencyIcon
              currency={collateralCurrency}
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <div className="font-bold text-xl sm:text-2xl">
              {collateralCurrency.symbol}
            </div>
            <div className="flex flex-col justify-center items-end ml-auto group-hover:hidden">
              <div className="text-xs sm:text-sm text-gray-400">As low as</div>
              <div className="text-base sm:text-xl font-bold">
                {!Number.isNaN(lowestApy)
                  ? Number.isFinite(lowestApy)
                    ? `${lowestApy.toFixed(2)}%`
                    : '-'
                  : '-'}
              </div>
            </div>
            <div className="text-gray-400 text-sm ml-auto hidden group-hover:block">
              <div className="flex flex-col items-end">
                <div>Max Multiple</div>
                <div>Fixed APY</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-6 self-stretch">
            <div className="flex flex-col items-start gap-4 self-stretch group-hover:hidden">
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
                    Mark Price
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
            <div className="flex-wrap items-start hidden group-hover:flex">
              {(debtCurrencies.length < MAX_VISIBLE_MARKETS
                ? debtCurrencies.concat(
                    Array(MAX_VISIBLE_MARKETS - debtCurrencies.length).fill({
                      address: '0x',
                      name: '',
                      symbol: '',
                      decimals: 0,
                    } as Currency),
                  )
                : debtCurrencies
              ).map((currency, index) => (
                <div
                  className="h-[37.3px] sm:h-[44px] md:h-[50px] flex-grow flex-shrink basis-1/2 pb-1 flex flex-col gap-1"
                  key={index}
                >
                  <div className="w-[128px] flex items-center gap-1 self-stretch">
                    <div className="font-semibold">
                      {maxMultipliers[currency.address] &&
                      !Number.isNaN(maxMultipliers[currency.address])
                        ? `${maxMultipliers[currency.address].toFixed(2)}x`
                        : '\uFEFF'}
                    </div>
                    {maxMultipliers[currency.address] &&
                    apys[currency.address] ? (
                      <div className="font-semibold text-gray-400">|</div>
                    ) : (
                      <></>
                    )}
                    <div className="font-semibold">
                      {apys[currency.address] &&
                      !Number.isNaN(apys[currency.address])
                        ? `${apys[currency.address].toFixed(2)}%`
                        : '\uFEFF'}
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs">{currency.symbol}</div>
                </div>
              ))}
            </div>
            <div className="w-full flex mt-4 sm:mt-0 md:absolute sm:bottom-4 sm:h-12 md:w-[264px] lg:w-[277px] flex-col items-center justify-center self-stretch bg-green-500 rounded-lg h-12 px-3 py-2 font-bold text-base text-white gap-2 hover:bg-green-400 dark:hover:bg-green-600">
              Leverage
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
