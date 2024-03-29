import React, { useMemo, useState } from 'react'
import { Tooltip } from 'react-tooltip'

import { LoanPosition } from '../../model/loan-position'
import {
  BigDecimal,
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
import { calculateLiquidationPrice, calculateLtv } from '../../utils/ltv'
import { LiquidationHistory } from '../../model/liquidation-history'
import { LiquidationHistoryModal } from '../modal/liquidation-history-modal'
import { HistorySvg } from '../svg/history-svg'

export const LeveragePositionCard = ({
  position,
  multiple,
  multipleFactor,
  pnl,
  profit,
  price,
  collateralPrice,
  averageDebtCurrencyPrice,
  averageCollateralWithoutBorrowedCurrencyPrice,
  onAdjustMultiple,
  onClose,
  onCollect,
  onEditCollateral,
  onEditExpiry,
  isDeptSizeLessThanMinDebtSize,
  liquidationHistories,
  explorerUrl,
}: {
  position: LoanPosition
  multiple: number
  multipleFactor?: number
  pnl: number
  profit: number
  price: BigDecimal
  collateralPrice: BigDecimal
  averageDebtCurrencyPrice: BigDecimal
  averageCollateralWithoutBorrowedCurrencyPrice: BigDecimal
  onAdjustMultiple: () => void
  onClose: () => void
  onCollect: () => void
  onEditCollateral: () => void
  onEditExpiry: () => void
  isDeptSizeLessThanMinDebtSize: boolean
  liquidationHistories: LiquidationHistory[]
  explorerUrl: string
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [showLiquidatedHistory, setShowLiquidatedHistory] = useState(false)
  const now = currentTimestampInSeconds()
  const isLiquidated = useMemo(
    () =>
      now >= Number(position.toEpoch.endTimestamp) || position.amount === 0n,
    [now, position.amount, position.toEpoch.endTimestamp],
  )
  const isShortPosition = useMemo(
    () =>
      isStableCoin(position.collateral.underlying) &&
      !isStableCoin(position.underlying),
    [position.collateral.underlying, position.underlying],
  )
  const [currentLtv, liquidationPrice] = useMemo(() => {
    return [
      calculateLtv(
        position.underlying,
        price,
        position.amount,
        position.collateral,
        collateralPrice,
        position.collateralAmount,
      ),
      calculateLiquidationPrice(
        position.underlying,
        price,
        position.collateral,
        collateralPrice,
        position.amount,
        position.collateralAmount,
      ),
    ]
  }, [collateralPrice, position, price])

  return (
    <div className="flex w-full pb-4 flex-col items-center gap-3 shrink-0  bg-white dark:bg-gray-800 rounded-xl">
      <div className="flex p-4 items-center self-stretch">
        <div className="flex items-center gap-3 flex-grow shrink-0 basis-0">
          {isShortPosition ? (
            <CurrencyIcon
              currency={position.underlying}
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
          ) : (
            <CurrencyIcon
              currency={position.collateral.underlying}
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
          )}
          <div className="flex flex-col">
            <div className="w-[89px] text-xs text-gray-500 dark:text-gray-400">
              {isShortPosition ? 'Short' : 'Long'} x{multiple.toFixed(2)}
            </div>
            <div className="text-base font-bold">
              {isShortPosition
                ? position.underlying.symbol
                : position.collateral.underlying.symbol}
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
            <div className="flex-grow flex-shrink basis-0 text-gray-400 text-sm  flex gap-1 items-center">
              Position Size
              {showLiquidatedHistory && liquidationHistories ? (
                <LiquidationHistoryModal
                  onClose={() => setShowLiquidatedHistory(false)}
                  liquidationHistories={liquidationHistories}
                  explorerUrl={explorerUrl}
                />
              ) : (
                <></>
              )}
              {liquidationHistories.length > 0 ? (
                <button onClick={() => setShowLiquidatedHistory(true)}>
                  <HistorySvg />
                </button>
              ) : (
                <></>
              )}
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
          <div className="flex items-center gap-1 self-stretch">
            <div className="flex-grow flex-shrink basis-0 text-gray-400 text-sm">
              PnL
            </div>
            {pnl ? (
              <div className="flex gap-1">
                <div
                  className={`text-sm sm:text-base flex gap-1 ${
                    pnl >= 1 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {pnl >= 1 ? '+' : '-'}$
                  {toCommaSeparated(Math.abs(profit).toFixed(2))} (
                  {pnl >= 1 ? '+' : ''}
                  {((pnl - 1) * 100).toFixed(2)}%)
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="flex items-center gap-1 self-stretch">
            <div className="flex-grow flex-shrink basis-0 text-gray-400 text-sm">
              Average / Mark
            </div>
            {isShortPosition ? (
              <div className="text-sm sm:text-base">
                {formatDollarValue(
                  BigInt(10 ** position.underlying.decimals),
                  position.underlying.decimals,
                  averageDebtCurrencyPrice,
                )}
                {' / '}
                {formatDollarValue(
                  BigInt(10 ** position.collateral.underlying.decimals),
                  position.collateral.underlying.decimals,
                  price,
                )}
              </div>
            ) : (
              <div className="text-sm sm:text-base">
                {formatDollarValue(
                  BigInt(10 ** position.collateral.underlying.decimals),
                  position.collateral.underlying.decimals,
                  averageCollateralWithoutBorrowedCurrencyPrice,
                )}
                {' / '}
                {formatDollarValue(
                  BigInt(10 ** position.collateral.underlying.decimals),
                  position.collateral.underlying.decimals,
                  collateralPrice,
                )}
              </div>
            )}
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
              className="flex-1 bg-green-500 bg-opacity-10 hover:bg-opacity-20 disabled:text-gray-500 disabled:bg-gray-100 text-green-500 font-bold px-3 py-2 rounded text-sm"
              onClick={onAdjustMultiple}
              disabled={position.isPending || !multipleFactor}
            >
              Adjust
            </button>
          ) : (
            <></>
          )}
          <button
            className="flex-1 bg-green-500 bg-opacity-10 hover:bg-opacity-20 disabled:animate-pulse disabled:text-gray-500 disabled:bg-gray-100 text-green-500 font-bold px-3 py-2 rounded text-sm"
            onClick={!isLiquidated ? onClose : onCollect}
            disabled={position.isPending}
          >
            {!isLiquidated ? 'Close' : 'Collect Collateral'}
          </button>
        </div>
      </div>
    </div>
  )
}
