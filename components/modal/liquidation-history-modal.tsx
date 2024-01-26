import React from 'react'
import Link from 'next/link'

import { LiquidationHistory } from '../../model/liquidation-history'
import { formatDollarValue, formatUnits } from '../../utils/numbers'
import { formatShortAddress } from '../../utils/string'

import Modal from './modal'

export const LiquidationHistoryModal = ({
  onClose,
  liquidationHistories,
  explorerUrl,
}: {
  onClose: () => void
  liquidationHistories: LiquidationHistory[]
  explorerUrl: string
}) => {
  if (liquidationHistories.length === 0) {
    return <></>
  }

  return (
    <Modal show onClose={onClose}>
      <h1 className="font-bold text-xl mb-8">Collateral liquidation history</h1>
      <div className="flex flex-col gap-3">
        <div className="w-full flex text-sm text-gray-400 justify-start dark:text-gray-500">
          <div className="flex w-[60px] sm:w-[88px]">Repaid</div>
          <div className="flex w-[88px]">Liquidated</div>
          <div className="flex w-[88px]">Col price</div>
          <div className="flex w-[88px]">Debt price</div>
          <div className="flex w-[90px]">Transaction</div>
        </div>
        <div className="flex flex-col text-sm">
          {liquidationHistories.map((liquidationHistory, index) => (
            <div className="flex h-10 w-full items-center" key={index}>
              <div className="flex w-[60px] sm:w-[88px]">
                {formatUnits(
                  liquidationHistory.repaidDebtAmount,
                  liquidationHistory.underlying.decimals,
                  liquidationHistory.debtCurrencyPrice,
                )}
              </div>
              <div className="flex w-[88px]">
                {formatUnits(
                  liquidationHistory.liquidatedCollateralAmount,
                  liquidationHistory.collateral.underlying.decimals,
                  liquidationHistory.collateralCurrencyPrice,
                )}
              </div>
              <div className="flex w-[88px]">
                {formatDollarValue(
                  1n,
                  0,
                  liquidationHistory.collateralCurrencyPrice,
                )}
              </div>
              <div className="flex w-[88px]">
                {formatDollarValue(1n, 0, liquidationHistory.debtCurrencyPrice)}
              </div>

              <Link
                className="flex w-[90px]"
                href={`${explorerUrl}/tx/${liquidationHistory.tx}`}
                target="_blank"
              >
                {formatShortAddress(liquidationHistory.tx)}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
