import React from 'react'

import Modal from '../../components/modal/modal'
import { ActionButton, ActionButtonProps } from '../button/action-button'
import Slider from '../slider'
import { DotSvg } from '../svg/dot-svg'
import { getLTVTextColor } from '../../utils/ltv'
import { ArrowSvg } from '../svg/arrow-svg'
import { Collateral } from '../../model/collateral'
import { BigDecimal, formatUnits } from '../../utils/numbers'
import { Currency } from '../../model/currency'

const AdjustLeverageModal = ({
  isLoadingResults,
  onClose,
  debtCurrency,
  debtCurrencyPrice,
  collateral,
  collateralPrice,
  multiple,
  setMultiple,
  maxAvailableMultiple,
  previousMultiple,
  currentLtv,
  expectedLtv,
  currentPositionSize,
  expectedPositionSize,
  currentRemainingDebt,
  expectedRemainingDebt,
  actionButtonProps,
}: {
  isLoadingResults: boolean
  onClose: () => void
  debtCurrency: Currency
  debtCurrencyPrice: BigDecimal
  collateral: Collateral
  collateralPrice: BigDecimal
  multiple: number
  setMultiple: (value: number) => void
  maxAvailableMultiple: number
  previousMultiple: number
  currentLtv: number
  expectedLtv: number
  currentPositionSize: bigint
  expectedPositionSize: bigint
  currentRemainingDebt: bigint
  expectedRemainingDebt: bigint
  actionButtonProps: ActionButtonProps
}) => {
  return (
    <Modal show onClose={() => {}} onButtonClick={onClose}>
      <h1 className="flex font-bold text-xl mb-2">Set multiple.</h1>
      <h3 className="font-semibold text-gray-400 text-sm">
        Max {maxAvailableMultiple.toFixed(2)} x
      </h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between flex-col relative rounded-lg pl-4 pr-12 sm:pl-0 sm:pr-6 sm:py-10">
            <div className="sm:px-6 sm:mb-2 my-8 sm:my-0">
              <div>
                <Slider
                  minPosition={0}
                  segments={(maxAvailableMultiple - 1) * 100 + 1}
                  value={(multiple - 1) * 100}
                  onValueChange={
                    (value) => setMultiple(value / 100 + 1) // value is 0-based
                  }
                  renderControl={() => (
                    <div className="absolute -top-3 -left-7 flex flex-col items-center gap-2 shrink-0">
                      <DotSvg />
                      <div className="flex px-2 py-1 justify-center w-[60px] items-center gap-1 rounded-2xl bg-green-500 bg-opacity-10 text-xs text-green-500 font-bold">
                        {multiple.toFixed(2)} x
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-start self-stretch">
              <div className="text-gray-400 text-xs sm:text-sm">Multiple</div>
              <div className="flex ml-auto items-center gap-1.5 text-xs sm:text-sm text-black dark:text-white">
                {previousMultiple.toFixed(2)}x
                {previousMultiple !== multiple ? (
                  <>
                    <ArrowSvg />
                    {multiple.toFixed(2)}x
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="flex items-start self-stretch">
              <div className="text-gray-400 text-xs sm:text-sm">LTV</div>
              <div className="flex ml-auto items-center gap-1.5 text-xs sm:text-sm text-black dark:text-white">
                <span className={`${getLTVTextColor(currentLtv, collateral)}`}>
                  {currentLtv.toFixed(2)}%
                </span>
                {previousMultiple !== multiple ? (
                  <>
                    <ArrowSvg />
                    {isLoadingResults ? (
                      <span className="w-[56px] h-[24px] mx-1 rounded animate-pulse bg-gray-300 dark:bg-gray-500" />
                    ) : (
                      <span
                        className={`${getLTVTextColor(
                          expectedLtv,
                          collateral,
                        )}`}
                      >
                        {expectedLtv.toFixed(2)}%
                      </span>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="flex items-start self-stretch">
              <div className="text-gray-400 text-xs sm:text-sm">
                Position Size ({collateral.underlying.symbol})
              </div>
              <div className="flex ml-auto items-center gap-1.5 text-xs sm:text-sm text-black dark:text-white">
                <span>
                  {formatUnits(
                    currentPositionSize,
                    collateral.underlying.decimals,
                    collateralPrice,
                  )}
                </span>
                {previousMultiple !== multiple ? (
                  <>
                    <ArrowSvg />
                    {isLoadingResults ? (
                      <span className="w-[56px] h-[24px] mx-1 rounded animate-pulse bg-gray-300 dark:bg-gray-500" />
                    ) : (
                      <span>
                        {formatUnits(
                          expectedPositionSize,
                          collateral.underlying.decimals,
                          collateralPrice,
                        )}
                      </span>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="flex items-start self-stretch">
              <div className="text-gray-400 text-xs sm:text-sm">
                Remaining Debt ({debtCurrency.symbol})
              </div>
              <div className="flex ml-auto items-center gap-1.5 text-xs sm:text-sm text-black dark:text-white">
                <span>
                  {formatUnits(
                    currentRemainingDebt,
                    debtCurrency.decimals,
                    debtCurrencyPrice,
                  )}
                </span>
                {previousMultiple !== multiple ? (
                  <>
                    <ArrowSvg />
                    {isLoadingResults ? (
                      <span className="w-[56px] h-[24px] mx-1 rounded animate-pulse bg-gray-300 dark:bg-gray-500" />
                    ) : (
                      <span>
                        {formatUnits(
                          expectedRemainingDebt,
                          debtCurrency.decimals,
                          debtCurrencyPrice,
                        )}
                      </span>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
        <ActionButton {...actionButtonProps} />
      </div>
    </Modal>
  )
}

export default AdjustLeverageModal
