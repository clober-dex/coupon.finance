import React from 'react'

import Modal from '../../components/modal/modal'
import { ActionButton, ActionButtonProps } from '../button/action-button'
import Slider from '../slider'
import { DotSvg } from '../svg/dot-svg'
import { getLTVTextColor } from '../../utils/ltv'
import { ArrowSvg } from '../svg/arrow-svg'
import { Collateral } from '../../model/collateral'

const AdjustLeverageModal = ({
  isLoadingResults,
  onClose,
  collateral,
  multiple,
  setMultiple,
  maxAvailableMultiple,
  currentMultiple,
  currentLtv,
  expectedLtv,
  actionButtonProps,
}: {
  isLoadingResults: boolean
  onClose: () => void
  collateral: Collateral
  multiple: number
  setMultiple: (value: number) => void
  maxAvailableMultiple: number
  currentMultiple: number
  currentLtv: number
  expectedLtv: number
  actionButtonProps: ActionButtonProps
}) => {
  return (
    <Modal show onClose={onClose}>
      <h1 className="flex font-bold text-xl mb-3">
        Set multiple.
        <span className="ml-auto font-semibold text-gray-400 text-sm">
          Max {maxAvailableMultiple.toFixed(2)}x
        </span>
      </h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between flex-col relative rounded-lg pl-4 pr-12 sm:pl-0 sm:pr-6 sm:py-10">
            <div className="sm:px-6 sm:mb-2 my-8 sm:my-0">
              <div>
                <Slider
                  minPosition={0}
                  segments={(maxAvailableMultiple - 1) * 100}
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
              <div className="text-gray-400 text-base">LTV</div>
              <div className="flex ml-auto items-center gap-1.5 text-base text-black dark:text-white">
                <span className={`${getLTVTextColor(currentLtv, collateral)}`}>
                  {currentLtv.toFixed(2)}%
                </span>
                {currentMultiple !== multiple ? (
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
              <div className="text-gray-400 text-base">Multiple</div>
              <div className="flex ml-auto items-center gap-1.5 text-base text-black dark:text-white">
                {currentMultiple.toFixed(2)}x
                {currentMultiple !== multiple ? (
                  <>
                    <ArrowSvg />
                    {multiple.toFixed(2)}x
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
