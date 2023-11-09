import React from 'react'
import Image from 'next/image'

import { BondPosition } from '../../model/bond-position'
import { BigDecimal, formatDollarValue, formatUnits } from '../../utils/numbers'
import { getLogo } from '../../model/currency'
import { calculateApy } from '../../utils/apy'
import { formatDate } from '../../utils/date'

export const BondPositionCard = ({
  position,
  price,
  onWithdraw,
  onCollect,
}: {
  position: BondPosition
  price?: BigDecimal
  onWithdraw: () => void
  onCollect: () => void
} & React.HTMLAttributes<HTMLDivElement>) => {
  const now = Math.floor(new Date().getTime() / 1000)
  return (
    <div className="flex w-full pb-4 flex-col items-center gap-3 shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow">
      <div className="flex p-4 items-center self-stretch">
        <div className="flex items-center gap-3 flex-grow flex-shrink basis-0">
          <div className="w-8 h-8 relative">
            <Image
              src={getLogo(position.underlying)}
              alt={position.underlying.name}
              fill
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-0.5">
            <div className="text-sm text-gray-500">Deposit</div>
            <div className="font-bold text-base">
              {position.underlying.symbol}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-end gap-0.5 font-bold">
          <div>
            {now < Number(position.toEpoch.endTimestamp) ? (
              <>
                <div className="flex text-sm text-gray-500 justify-end font-normal">
                  Expires
                </div>
                {formatDate(
                  new Date(Number(position.toEpoch.endTimestamp) * 1000),
                )}
              </>
            ) : (
              <div className="font-bold text-base">Expired</div>
            )}
          </div>
        </div>
      </div>
      <div className="flex py-0 px-4 flex-col items-start gap-8 self-stretch">
        <div className="flex flex-col items-start gap-3 self-stretch">
          <div className="flex items-center gap-1 self-stretch">
            <div className="flex-grow flex-shrink basis-0 text-gray-400 text-sm">
              Earned Interest
            </div>
            <div className="text-base font-bold">
              {formatDollarValue(
                position.interest,
                position.underlying.decimals,
                price,
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 self-stretch">
            <div className="flex-grow flex-shrink basis-0 text-gray-400 text-sm">
              APY
            </div>
            <div className="text-base">
              {calculateApy(
                Number(position.interest) / Number(position.amount),
                position.toEpoch.endTimestamp - position.createdAt,
              ).toFixed(2)}
              %
            </div>
          </div>
          <div className="flex items-center gap-1 self-stretch">
            <div className="flex-grow flex-shrink basis-0 text-gray-400 text-sm">
              Deposited
            </div>
            <div className="text-base">
              {formatUnits(
                position.amount,
                position.underlying.decimals,
                price,
              )}{' '}
              {position.underlying.symbol}{' '}
              <span className="text-gray-500 text-xs">
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
        {position.toEpoch.endTimestamp < now ? (
          <button
            className="w-full bg-blue-500 bg-opacity-10 text-blue-500 font-bold px-3 py-2 rounded text-xs"
            onClick={onCollect}
          >
            Claim Interest
          </button>
        ) : (
          <button
            className="w-full bg-green-500 bg-opacity-10 text-green-500 font-bold px-3 py-2 rounded text-xs"
            onClick={onWithdraw}
          >
            Withdraw
          </button>
        )}
      </div>
    </div>
  )
}
