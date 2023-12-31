import React from 'react'

import { BondPosition } from '../../model/bond-position'
import { BigDecimal, formatDollarValue, formatUnits } from '../../utils/numbers'
import { calculateApy } from '../../utils/apy'
import { currentTimestampInSeconds, formatDate } from '../../utils/date'
import { CurrencyIcon } from '../icon/currency-icon'

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
}) => {
  const now = currentTimestampInSeconds()
  return (
    <div className="relative flex w-full pb-4 flex-col items-center gap-3 shrink-0 bg-white dark:bg-gray-800 rounded-xl">
      <div className="flex p-4 items-center self-stretch">
        <div className="flex items-center gap-3 flex-grow flex-shrink basis-0">
          <CurrencyIcon
            currency={position.underlying}
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <div className="flex flex-col">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Deposit
            </div>
            <div className="font-bold text-base">
              {position.underlying.symbol}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-end gap-0.5 font-bold">
          <div>
            {now < Number(position.toEpoch.endTimestamp) ? (
              <>
                <div className="flex text-xs text-gray-500 dark:text-gray-400 justify-end font-normal">
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
              Deposited
            </div>
            <div className="text-sm sm:text-base">
              {formatUnits(
                position.amount,
                position.underlying.decimals,
                price,
              )}{' '}
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
          <div className="flex items-center gap-1 self-stretch">
            <div className="flex-grow flex-shrink basis-0 text-gray-400 text-sm">
              Earned Interest
            </div>
            <div className="text-sm sm:text-base">
              {formatUnits(
                position.interest,
                position.underlying.decimals,
                price,
              )}{' '}
              <span className="text-gray-500 text-xs">
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
          <div className="flex items-center gap-1 self-stretch">
            <div className="flex-grow flex-shrink basis-0 text-gray-400 text-sm">
              APY
            </div>
            <div className="text-sm sm:text-base">
              {calculateApy(
                Number(position.interest) / Number(position.amount),
                position.toEpoch.endTimestamp - position.createdAt,
              ).toFixed(2)}
              %
            </div>
          </div>
        </div>
        {position.toEpoch.endTimestamp < now ? (
          <button
            className="w-full bg-blue-500 bg-opacity-10 hover:bg-opacity-20 disabled:animate-pulse disabled:text-gray-500 disabled:bg-gray-100 text-blue-500 font-bold px-3 py-2 rounded text-sm"
            onClick={onCollect}
            disabled={position.isPending}
          >
            Collect Deposit
          </button>
        ) : (
          <button
            className="w-full bg-green-500 bg-opacity-10 hover:bg-opacity-20 disabled:animate-pulse disabled:text-gray-500 disabled:bg-gray-100 text-green-500 font-bold px-3 py-2 rounded text-sm"
            onClick={onWithdraw}
            disabled={position.isPending}
          >
            Withdraw
          </button>
        )}
      </div>
    </div>
  )
}
