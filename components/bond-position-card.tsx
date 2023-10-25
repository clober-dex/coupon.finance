import React from 'react'
import Image from 'next/image'

import { BondPosition } from '../model/bond-position'
import { BigDecimal, formatDollarValue, formatUnits } from '../utils/numbers'
import { getLogo } from '../model/currency'
import { calculateApy } from '../utils/apy'

export const BondPositionCard = ({
  position,
  price,
  onWithdraw,
  onCollect,
  ...props
}: {
  position: BondPosition
  price?: BigDecimal
  onWithdraw: () => void
  onCollect: () => void
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="rounded-xl shadow bg-gray-50 dark:bg-gray-900" {...props}>
      <div className="flex justify-between rounded-t-xl p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative">
            <Image
              src={getLogo(position.underlying)}
              alt={position.underlying.name}
              fill
            />
          </div>
          <div className="flex flex-col">
            <div className="font-bold">{position.underlying.symbol}</div>
            <div className="text-gray-500 text-sm">
              {position.underlying.name}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="font-bold">
            {calculateApy(
              Number(position.interest) / Number(position.amount),
              position.toEpoch.endTimestamp - position.createdAt,
            ).toFixed(2)}
            %
          </div>
          <div className="text-xs sm:text-sm">
            {new Date(Number(position.toEpoch.endTimestamp) * 1000)
              .toISOString()
              .slice(2, 10)
              .replace(/-/g, '/')}
          </div>
        </div>
      </div>
      <div className="flex flex-col rounded-b-xl p-4 gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-xs">Interest</div>
            <div className="flex gap-1 text-xs sm:text-sm">
              {formatUnits(
                position.interest,
                position.underlying.decimals,
                price,
              )}
              <span className="text-gray-500">
                (
                {formatDollarValue(
                  position.interest,
                  position.underlying.decimals,
                  price,
                )}
                )
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="text-gray-500">Deposited</div>
            <div className="flex gap-1 text-xs sm:text-sm">
              {formatUnits(
                position.amount,
                position.underlying.decimals,
                price,
              )}
              <span className="text-gray-500">
                (
                {formatDollarValue(
                  position.amount,
                  position.underlying.decimals,
                  price,
                )}
                )
              </span>
            </div>
          </div>
        </div>
        {position.toEpoch.endTimestamp * 1000 < new Date().getTime() ? (
          <button
            className="bg-blue-500 bg-opacity-10 text-blue-500 font-bold px-3 py-2 rounded text-xs"
            onClick={onCollect}
          >
            Collect
          </button>
        ) : (
          <button
            className="bg-green-500 bg-opacity-10 text-green-500 font-bold px-3 py-2 rounded text-xs"
            onClick={onWithdraw}
          >
            Withdraw
          </button>
        )}
      </div>
    </div>
  )
}
