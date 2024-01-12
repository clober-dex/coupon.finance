import React, { useMemo } from 'react'
import { Tooltip } from 'react-tooltip'

import { LoanPosition } from '../../model/loan-position'
import {
  BigDecimal,
  dollarValue,
  formatDollarValue,
  formatUnits,
  toCommaSeparated,
} from '../../utils/numbers'
import { EditSvg } from '../svg/edit-svg'
import {
  currentTimestampInSeconds,
  formatDate,
  getExpirationDateTextColor,
} from '../../utils/date'
import { CurrencyIcon } from '../icon/currency-icon'
import { QuestionMarkSvg } from '../svg/question-mark-svg'
import { isStableCoin } from '../../contexts/currency-context'

export const LoanPositionCard = ({
  position,
  price,
  collateralPrice,
  onRepay,
  onCollect,
  onBorrowMore,
  onEditCollateral,
  onEditExpiry,
  isDeptSizeLessThanMinDebtSize,
}: {
  position: LoanPosition
  price?: BigDecimal
  collateralPrice?: BigDecimal
  onRepay: () => void
  onCollect: () => void
  onBorrowMore: () => void
  onEditCollateral: () => void
  onEditExpiry: () => void
  isDeptSizeLessThanMinDebtSize: boolean
} & React.HTMLAttributes<HTMLDivElement>) => {
  const now = currentTimestampInSeconds()
  const isShortPosition = useMemo(
    () =>
      isStableCoin(position.collateral.underlying) &&
      !isStableCoin(position.underlying),
    [position.collateral.underlying, position.underlying],
  )
  const [currentLtv, liquidationPrice] = useMemo(() => {
    const collateralDollarValue = dollarValue(
      position.collateralAmount,
      position.collateral.underlying.decimals,
      collateralPrice,
    )
    const debtDollarValue = dollarValue(
      position.amount,
      position.underlying.decimals,
      price,
    )
    const liquidationThreshold =
      Number(position.collateral.liquidationThreshold) /
      Number(position.collateral.ltvPrecision)
    const currentPrice =
      price && collateralPrice
        ? Number(price.value) / Number(collateralPrice.value)
        : 0
    const liquidatePrice = collateralDollarValue
      .div(debtDollarValue)
      .times(liquidationThreshold)
      .times(currentPrice)
      .toNumber()
    return [
      debtDollarValue.times(100).div(collateralDollarValue),
      isStableCoin(position.collateral.underlying) ||
      isStableCoin(position.underlying)
        ? isShortPosition
          ? liquidatePrice
          : 1 / liquidatePrice
        : 0,
    ]
  }, [collateralPrice, isShortPosition, position, price])

  const isLiquidated = useMemo(
    () =>
      now >= Number(position.toEpoch.endTimestamp) || position.amount === 0n,
    [now, position.amount, position.toEpoch.endTimestamp],
  )

  return (
    <div className="flex w-full pb-4 flex-col items-center gap-3 shrink-0  bg-white dark:bg-gray-800 rounded-xl">
      <div className="flex p-4 items-center self-stretch">
        <div className="flex items-center gap-3 flex-grow shrink-0 basis-0">
          <CurrencyIcon
            currency={position.underlying}
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
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
            {!isLiquidated ? (
              <>
                <div className="flex text-xs text-gray-500 dark:text-gray-400 justify-end font-normal">
                  <div className="flex flex-row gap-1 items-center justify-center">
                    Expires
                    <QuestionMarkSvg
                      data-tooltip-id="expiry-date-tooltip"
                      data-tooltip-content="The position will be liquidated if not repaid by this date."
                      className="w-3 h-3"
                    />
                    <Tooltip
                      id="expiry-date-tooltip"
                      style={{
                        width: '200px',
                      }}
                    />
                  </div>
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
                  {!position.isPending && !isDeptSizeLessThanMinDebtSize ? (
                    <button>
                      <EditSvg onClick={onEditExpiry} />
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            ) : (
              <div className="font-bold text-base">Liquidated</div>
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
              {!isLiquidated &&
              !position.isPending &&
              !isDeptSizeLessThanMinDebtSize ? (
                <button>
                  <EditSvg onClick={onEditCollateral} />
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
          {liquidationPrice ? (
            <div className="flex items-center gap-1 self-stretch">
              <div className="flex-grow flex-shrink basis-0 text-gray-400 text-sm">
                Liquidation Price
              </div>
              <div className="text-sm sm:text-base">
                ${toCommaSeparated(liquidationPrice.toFixed(2))}
              </div>
            </div>
          ) : (
            <></>
          )}
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
          {!isLiquidated ? (
            <button
              className="flex-1 bg-green-500 bg-opacity-10 hover:bg-opacity-20 disabled:animate-pulse disabled:text-gray-500 disabled:bg-gray-100 text-green-500 font-bold px-3 py-2 rounded text-sm"
              onClick={onBorrowMore}
              disabled={position.isPending}
            >
              Borrow More
            </button>
          ) : (
            <></>
          )}
          <button
            className="flex-1 bg-green-500 bg-opacity-10 hover:bg-opacity-20 disabled:animate-pulse disabled:text-gray-500 disabled:bg-gray-100 text-green-500 font-bold px-3 py-2 rounded text-sm"
            onClick={!isLiquidated ? onRepay : onCollect}
            disabled={position.isPending}
          >
            {!isLiquidated ? 'Repay' : 'Collect Collateral'}
          </button>
        </div>
      </div>
    </div>
  )
}
