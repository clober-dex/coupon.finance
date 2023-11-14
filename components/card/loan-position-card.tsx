import React, { useMemo } from 'react'
import Image from 'next/image'

import { LoanPosition } from '../../model/loan-position'
import {
  BigDecimal,
  dollarValue,
  formatDollarValue,
  formatUnits,
} from '../../utils/numbers'
import { getLogo } from '../../model/currency'
import { EditSvg } from '../svg/edit-svg'
import {
  currentTimestampInSeconds,
  formatDate,
  getExpirationDateTextColor,
} from '../../utils/date'

export const LoanPositionCard = ({
  position,
  price,
  collateralPrice,
  onRepay,
  onBorrowMore,
  onEditCollateral,
  onEditExpiry,
}: {
  position: LoanPosition
  price?: BigDecimal
  collateralPrice?: BigDecimal
  onRepay: () => void
  onBorrowMore: () => void
  onEditCollateral: () => void
  onEditExpiry: () => void
} & React.HTMLAttributes<HTMLDivElement>) => {
  const now = currentTimestampInSeconds()
  const currentLtv = useMemo(
    () =>
      dollarValue(position.amount, position.underlying.decimals, price)
        .times(100)
        .div(
          dollarValue(
            position.collateralAmount,
            position.collateral.underlying.decimals,
            collateralPrice,
          ),
        ),
    [collateralPrice, position, price],
  )

  return (
    <div className="flex w-full pb-4 flex-col items-center gap-3 shrink-0  bg-white dark:bg-gray-800 rounded-xl">
      <div className="flex p-4 items-center self-stretch">
        <div className="flex items-center gap-3 flex-grow shrink-0 basis-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 relative">
            <Image
              src={getLogo(position.underlying)}
              alt={position.underlying.name}
              fill
            />
          </div>
          <div className="flex flex-col">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Borrow
            </div>
            <div className="text-base font-bold">
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
                <div
                  className={`flex gap-1 ${getExpirationDateTextColor(
                    position.toEpoch.endTimestamp,
                    now,
                  )}`}
                >
                  {formatDate(
                    new Date(Number(position.toEpoch.endTimestamp) * 1000),
                  )}
                  <button>
                    <EditSvg onClick={onEditExpiry} />
                  </button>
                </div>
              </>
            ) : (
              <div className="font-bold text-base">Expired</div>
            )}
          </div>
        </div>
      </div>
      <div className="flex px-4 py-0 flex-col items-start gap-8 flex-grow shrink-0 basis-0 self-stretch">
        <div className="flex flex-col items-start gap-3 flex-grow shrink-0 basis-0 self-stretch">
          <div className="flex items-center gap-1 self-stretch">
            <div className="flex-grow flex-shrink basis-0 text-gray-400 text-sm">
              Borrowed
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
              Interest Charged
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
              Collateral
            </div>
            <div className="flex gap-1">
              <div className="text-sm sm:text-base">
                {formatUnits(
                  position.collateralAmount,
                  position.collateral.underlying.decimals,
                  collateralPrice,
                )}{' '}
                {position.collateral.underlying.symbol}
              </div>
              <button>
                <EditSvg onClick={onEditCollateral} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1 self-stretch">
            <div className="flex-grow flex-shrink basis-0 text-gray-400 text-sm">
              Current / Liq. LTV
            </div>
            <div className="text-sm sm:text-base">
              {currentLtv.toFixed(2)}% /{'  '}
              {(
                (Number(position.collateral.liquidationThreshold) * 100) /
                Number(position.collateral.ltvPrecision)
              ).toFixed(2)}
              %
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 self-stretch">
          <button
            className="flex-1 bg-green-500 bg-opacity-10 hover:bg-opacity-20 text-green-500 font-bold px-3 py-2 rounded text-sm"
            onClick={onBorrowMore}
          >
            Borrow More
          </button>
          <button
            className="flex-1 bg-green-500 bg-opacity-10 hover:bg-opacity-20 text-green-500 font-bold px-3 py-2 rounded text-sm"
            onClick={onRepay}
          >
            Repay
          </button>
        </div>
      </div>
    </div>
  )
}
