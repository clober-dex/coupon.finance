import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Currency, getLogo } from '../../model/currency'

export const DepositDetailCard = ({
  currency,
  apys,
}: {
  currency: Currency
  apys: { date: string; apy: number }[]
}) => (
  <div className="flex w-[312px] p-6 flex-col items-start gap-6 bg-white dark:bg-gray-800 rounded-xl shadow">
    <div className="flex h-[46px] items-center gap-2 shrink-0 self-stretch">
      <div className="flex items-center gap-3 flex-grow shrink-0 basis-0">
        <div className="w-[40px] h-[40px] relative">
          <Image src={getLogo(currency)} alt={currency.name} fill />
        </div>
        <div className="text-xl font-bold">{currency.symbol}</div>
      </div>
      <div className="text-gray-400 text-sm">Fixed APY</div>
    </div>
    <div className="flex flex-col items-start gap-7 self-stretch">
      <div className="flex flex-col items-start self-stretch gap-3">
        {apys.map(({ date, apy }, i) => (
          <div className="flex items-start self-stretch" key={i}>
            <div className="felx flex-grow shrink-0 basis-0 text-gray-950 font-bold">
              {apy.toFixed(2)}%
            </div>
            <div className="text-gray-500 text-base">{date}</div>
          </div>
        ))}
      </div>
      <Link
        href={`/deposit/${currency.symbol}`}
        className="w-full flex flex-col items-center justify-center self-stretch bg-green-500 rounded h-12 px-3 py-2 font-bold text-base text-white gap-2"
      >
        Deposit
      </Link>
    </div>
  </div>
)
