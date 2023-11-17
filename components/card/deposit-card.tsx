import React from 'react'
import Link from 'next/link'
import { isAddressEqual } from 'viem'

import { Currency } from '../../model/currency'
import { BigDecimal, formatUnits } from '../../utils/numbers'
import { Collateral } from '../../model/collateral'
import { CurrencyIcon } from '../icon/currency-icon'
import { MAX_VISIBLE_MARKETS } from '../../utils/market'

export const DepositCard = ({
  currency,
  collaterals,
  apys,
  available,
  deposited,
  price,
}: {
  currency: Currency
  collaterals: Collateral[]
  apys: { date: string; apy: number }[]
  available: bigint
  deposited: bigint
  price?: BigDecimal
}) => {
  const apy = Math.max(
    ...apys.filter(({ apy }) => !Number.isNaN(apy)).map(({ apy }) => apy),
  )
  return (
    <Link href={`/deposit/${currency.symbol}`}>
      <div className="h-[300px] transition ease-in-out delay-150 duration-300 sm:hover:-translate-y-1 sm:hover:scale-105 group flex flex-col w-full px-4 py-6 justify-center items-center gap-4 bg-white dark:bg-gray-800 rounded-xl">
        <div className="flex flex-col items-start gap-6 hover:gap-4 self-stretch">
          <div className="flex items-center gap-3 self-stretch">
            <CurrencyIcon
              currency={currency}
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <div className="font-bold text-xl sm:text-2xl">
              {currency.symbol}
            </div>
            <div className="flex flex-col justify-center items-end ml-auto group-hover:hidden">
              <div className="text-xs sm:text-sm text-gray-400">As high as</div>
              <div className="text-base sm:text-xl font-bold">
                {!Number.isNaN(apy)
                  ? Number.isFinite(apy)
                    ? `${apy.toFixed(2)}%`
                    : '-'
                  : '-'}
              </div>
            </div>
            <div className="text-gray-400 text-sm ml-auto hidden group-hover:block">
              Fixed APY
            </div>
          </div>
          <div className="group flex flex-col items-start gap-6 self-stretch">
            <div className="flex flex-col items-start gap-4 self-stretch group-hover:hidden">
              <div className="flex items-center self-stretch">
                <div className="flex flex-col items-start gap-1 flex-grow flex-shrink-0 basis-0">
                  <div className="text-xs sm:text-sm text-gray-400">
                    Available
                  </div>
                  <div className="flex items-baseline gap-1 self-stretch">
                    <span className="text-base sm:text-xl font-bold">
                      {formatUnits(available, currency.decimals, price)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-xs sm:text-sm text-gray-400">
                    Total Deposited
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base sm:text-xl font-bold">
                      {formatUnits(deposited, currency.decimals, price)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col item-start gap-3 self-stretch">
                <div className="text-gray-400 text-xs sm:text-sm">
                  Collateral List
                </div>
                <div className="flex items-start gap-2 self-stretch rounded-lg">
                  {collaterals
                    .filter(
                      (collateral) =>
                        !isAddressEqual(
                          collateral.underlying.address,
                          currency.address,
                        ),
                    )
                    .map((collateral) => (
                      <React.Fragment key={collateral.underlying.address}>
                        <CurrencyIcon
                          currency={collateral.underlying}
                          className="w-6 h-6"
                        />
                      </React.Fragment>
                    ))}
                </div>
              </div>
            </div>
            <div className="flex-wrap items-start hidden group-hover:flex">
              {(apys.length < MAX_VISIBLE_MARKETS
                ? apys.concat(
                    Array(MAX_VISIBLE_MARKETS - apys.length).fill({
                      date: '',
                      apy: Number.NaN,
                    }),
                  )
                : apys
              ).map(({ date, apy }, index) => (
                <div
                  className="flex-grow flex-shrink basis-1/2 pb-1 flex flex-col gap-1"
                  key={index}
                >
                  <div className="felx flex-grow shrink-0 basis-0 font-bold text-lg">
                    {!Number.isNaN(apy)
                      ? `${apy.toFixed(2)}%`
                      : date
                      ? '-'
                      : '\uFEFF'}
                  </div>
                  <div className="text-gray-500 text-xs">{date}</div>
                </div>
              ))}
            </div>
            <div className="w-full flex flex-col items-center justify-center self-stretch bg-green-500 rounded-lg h-12 px-3 py-2 font-bold text-base text-white gap-2 hover:bg-green-400 dark:hover:bg-green-600">
              Deposit
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
