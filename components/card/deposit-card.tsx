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
  apy,
  available,
  deposited,
  price,
}: {
  currency: Currency
  collaterals: Collateral[]
  apy: number
  available: bigint
  deposited: bigint
  price?: BigDecimal
}) => (
  <div className="flex flex-col w-full sm:w-[328px] p-4 justify-center items-center gap-4 bg-white dark:bg-gray-800 rounded-xl shadow">
    <div className="flex flex-col items-start gap-3 self-stretch">
      <div className="flex items-center gap-2 self-stretch">
        <div className="w-8 h-8 relative">
          <Image src={getLogo(currency)} alt={currency.name} fill />
        </div>
        <div className="font-bold text-xl">{currency.symbol}</div>
        <div className="flex flex-col justify-center items-end ml-auto gap-1">
          <div className="text-xs text-gray-400">As high as</div>
          <div className="text-base font-bold">{apy.toFixed(2)}%</div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-6 self-stretch">
        <div className="flex flex-col items-start gap-4 self-stretch">
          <div className="flex items-center self-stretch">
            <div className="flex flex-col items-start gap-1 flex-grow flex-shrink-0 basis-0">
              <div className="text-xs text-gray-400">Available</div>
              <div className="flex items-center gap-1 self-stretch">
                <span className="text-base font-bold">
                  {formatUnits(available, currency.decimals, price)}
                </span>
                <span className="text-xs font-bold">{currency.symbol}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="text-xs text-gray-400">Total Deposited</div>
              <div className="flex items-center gap-1 self-stretch">
                <span className="text-base font-bold">
                  {formatUnits(deposited, currency.decimals, price)}
                </span>
                <span className="text-xs font-bold">{currency.symbol}</span>
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
        <Link
          href={`/deposit/${currency.symbol}`}
          className="w-full flex flex-col items-center justify-center self-stretch bg-green-500 rounded h-12 px-3 py-2 font-bold text-base text-white gap-2"
        >
          Deposit
        </Link>
      </div>
    </div>
  </div>
)
