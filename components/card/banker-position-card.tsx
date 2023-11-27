import React from 'react'

import { BondPosition } from '../../model/bond-position'
import { BigDecimal, formatDollarValue, formatUnits } from '../../utils/numbers'
import { currentTimestampInSeconds, formatDate } from '../../utils/date'
import { CurrencyIcon } from '../icon/currency-icon'

export const BankerPositionCard = ({
  position,
  price,
  children,
}: {
  position: BondPosition
  price?: BigDecimal
} & React.HTMLAttributes<HTMLDivElement>) => {
  const now = currentTimestampInSeconds()
  return (
    <div className="relative flex flex-col items-center gap-3 shrink-0">
      <div className="flex flex-col w-full bg-white dark:bg-gray-800 rounded-xl pb-4">
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
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
