import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { isAddressEqual } from 'viem'

import { Currency, getLogo } from '../../model/currency'
import { BigDecimal, formatUnits } from '../../utils/numbers'
import { Collateral } from '../../model/collateral'

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
      <div className="transition ease-in-out delay-150 duration-300 sm:hover:-translate-y-1 sm:hover:scale-105 group flex flex-col h-[275px] w-full p-4 justify-center items-center gap-4 bg-white dark:bg-gray-800 rounded-xl">
        <div className="flex flex-col items-start gap-3 self-stretch">
          <div className="flex items-center gap-2 self-stretch">
            <div className="w-8 h-8 relative">
              <Image src={getLogo(currency)} alt={currency.name} fill />
            </div>
            <div className="font-bold text-xl">{currency.symbol}</div>
            <div className="flex flex-col justify-center items-end ml-auto gap-1 group-hover:hidden">
              <div className="text-xs text-gray-400">As high as</div>
              <div className="text-base font-bold">
                {!Number.isNaN(apy) ? `${apy.toFixed(2)}%` : '-'}
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
                  <div className="text-xs text-gray-400">Available</div>
                  <div className="flex items-baseline gap-1 self-stretch">
                    <span className="text-base font-bold">
                      {formatUnits(available, currency.decimals, price)}
                    </span>
                    <span className="text-xs font-semibold">
                      {currency.symbol}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-xs text-gray-400">Total Deposited</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold">
                      {formatUnits(deposited, currency.decimals, price)}
                    </span>
                    <span className="text-xs font-semibold">
                      {currency.symbol}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col item-start gap-2 self-stretch">
                <div className="text-gray-400 text-xs">Collateral List</div>
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
                      <React.Fragment key={collateral.underlying.symbol}>
                        <div className="w-6 h-6 relative">
                          <Image
                            src={getLogo(collateral.underlying)}
                            alt={collateral.underlying.name}
                            fill
                          />
                        </div>
                      </React.Fragment>
                    ))}
                </div>
              </div>
            </div>
            <div className="flex-col items-start self-stretch gap-3 hidden group-hover:flex">
              {apys.map(({ date, apy }, i) => (
                <div className="flex items-start self-stretch" key={i}>
                  <div className="felx flex-grow shrink-0 basis-0 font-bold">
                    {!Number.isNaN(apy) ? `${apy.toFixed(2)}%` : '-'}
                  </div>
                  <div className="text-gray-500 text-base">{date}</div>
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
