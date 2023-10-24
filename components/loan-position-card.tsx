import React, { useMemo } from 'react'
import Image from 'next/image'

import { LoanPosition } from '../model/loan-position'
import {
  BigDecimal,
  dollarValue,
  formatDollarValue,
  formatUnits,
} from '../utils/numbers'
import { getLogo } from '../model/currency'
import { calculateApr } from '../utils/apr'

import { EditSvg } from './svg/edit-svg'

export const LoanPositionCard = ({
  position,
  price,
  collateralPrice,
  onRepay,
  onBorrowMore,
  onEditCollateral,
  onEditExpiry,
  ...props
}: {
  position: LoanPosition
  price?: BigDecimal
  collateralPrice?: BigDecimal
  onRepay: () => void
  onBorrowMore: () => void
  onEditCollateral: () => void
  onEditExpiry: () => void
} & React.HTMLAttributes<HTMLDivElement>) => {
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
            {calculateApr(
              Number(position.interest) / Number(position.amount),
              position.toEpoch.endTimestamp - position.createdAt,
            ).toFixed(2)}
            %
          </div>
          <div className="flex items-center gap-1">
            <div className="text-xs sm:text-sm">
              {new Date(Number(position.toEpoch.endTimestamp) * 1000)
                .toISOString()
                .slice(2, 10)
                .replace(/-/g, '/')}
            </div>
            <button>
              <EditSvg onClick={onEditExpiry} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col rounded-b-xl p-4 gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <div className="text-gray-500">Borrow Amount</div>
            <div className="flex gap-1 text-xs sm:text-sm">
              {formatUnits(
                position.amount - position.interest,
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
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-xs">Collateral</div>
            <div className="flex items-center gap-1">
              <div className="text-xs sm:text-sm">
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
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <div>LTV</div>
            <div className="flex text-green-500 text-xs sm:text-sm">
              {currentLtv.toFixed(2)}%
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="text-gray-500">Liquidation Threshold</div>
            <div className="flex text-xs sm:text-sm">
              {formatUnits(BigInt(position.collateral.liquidationThreshold), 4)}
              %
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            className="flex-1 bg-green-500 bg-opacity-10 text-green-500 font-bold px-3 py-2 rounded text-xs"
            onClick={onBorrowMore}
          >
            Borrow More
          </button>
          <button
            className="flex-1 bg-green-500 bg-opacity-10 text-green-500 font-bold px-3 py-2 rounded text-xs"
            onClick={onRepay}
          >
            Repay
          </button>
        </div>
      </div>
    </div>
  )
}
