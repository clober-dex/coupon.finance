import React from 'react'

import { BigDecimal, formatUnits } from '../../utils/numbers'
import CurrencyAmountInput from '../currency-amount-input'
import { Arrow } from '../svg/arrow'
import SwapSvg from '../svg/swap-svg'
import SlippageSelect from '../slippage-select'
import Modal from '../../components/modal/modal'
import { max } from '../../utils/bigint'
import { ActionButton, ActionButtonProps } from '../action-button'
import { Currency } from '../../model/currency'
import { Collateral } from '../../model/collateral'

const RepayModal = ({
  debtCurrency,
  collateral,
  collateralAmount,
  onClose,
  value,
  setValue,
  showSlippageSelect,
  setShowSlippageSelect,
  isUseCollateral,
  setIsUseCollateral,
  slippage,
  setSlippage,
  repayAmount,
  maxRepayableAmount,
  currentLtv,
  expectedLtv,
  remainingDebt,
  actionButtonProps,
  debtAssetPrice,
  collateralPrice,
}: {
  debtCurrency: Currency
  collateral: Collateral
  collateralAmount: bigint
  onClose: () => void
  value: string
  setValue: (value: string) => void
  showSlippageSelect: boolean
  setShowSlippageSelect: React.Dispatch<React.SetStateAction<boolean>>
  isUseCollateral: boolean
  setIsUseCollateral: (isUseCollateral: boolean) => void
  slippage: string
  setSlippage: React.Dispatch<React.SetStateAction<string>>
  repayAmount: bigint
  maxRepayableAmount: bigint
  currentLtv: number
  expectedLtv: number
  remainingDebt: bigint
  actionButtonProps: ActionButtonProps
  debtAssetPrice?: BigDecimal
  collateralPrice?: BigDecimal
}) => {
  return (
    <Modal
      show
      onClose={onClose}
      onModalClick={() => setShowSlippageSelect(false)}
    >
      <h1 className="font-bold text-sm sm:text-xl mb-4 sm:mb-6">Repay</h1>
      <div className="flex mb-6 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-500">
        <button
          className="flex-1 py-2 rounded border-gray-100 dark:border-gray-800 disabled:bg-white dark:disabled:bg-gray-800 disabled:border-green-500 dark:disabled:border-green-500 disabled:text-green-500 border-[1.5px]"
          disabled={!isUseCollateral}
          onClick={() => setIsUseCollateral(false)}
        >
          Repay with <br className="flex sm:hidden" /> Wallet Balance
        </button>
        <button
          className="flex-1 py-2 rounded border-gray-100 dark:border-gray-800 disabled:bg-white dark:disabled:bg-gray-800 disabled:border-green-500 dark:disabled:border-green-500 disabled:text-green-500 border-[1.5px]"
          disabled={isUseCollateral}
          onClick={() => setIsUseCollateral(true)}
        >
          Repay with <br className="flex sm:hidden" /> Collateral
        </button>
      </div>
      <div className="mb-6">
        {isUseCollateral ? (
          <div className="flex flex-col w-full">
            <div className="mb-4 font-bold">Collateral amount to be used</div>
            <CurrencyAmountInput
              currency={collateral.underlying}
              value={value}
              onValueChange={setValue}
              price={collateralPrice}
              availableAmount={collateralAmount}
            />
            <SwapSvg className="w-4 h-4 sm:w-6 sm:h-6 self-center my-3 sm:my-4" />
            <div className="mb-4 font-bold">
              How much would you like to repay
            </div>
            <CurrencyAmountInput
              currency={debtCurrency}
              value={formatUnits(repayAmount, debtCurrency.decimals)}
              onValueChange={setValue}
              price={debtAssetPrice}
              availableAmount={0n}
              disabled
            />
          </div>
        ) : (
          <>
            <div className="mb-4 font-bold">
              How much would you like to repay?
            </div>
            <CurrencyAmountInput
              currency={debtCurrency}
              value={value}
              onValueChange={setValue}
              price={debtAssetPrice}
              availableAmount={maxRepayableAmount}
            />
          </>
        )}
      </div>
      <div className="flex justify-between items-center mb-3">
        <div className="font-bold">Transaction Overview</div>
        {isUseCollateral ? (
          <SlippageSelect
            show={showSlippageSelect}
            setShow={setShowSlippageSelect}
            slippage={slippage}
            setSlippage={setSlippage}
          />
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-col gap-2 text-gray-500 text-sm mb-8">
        <div className="flex gap-3 justify-between sm:justify-start">
          <div className="text-gray-500">Remaining Debt</div>
          <div className="flex items-center gap-1">
            <span>
              {formatUnits(
                remainingDebt,
                debtCurrency.decimals,
                debtAssetPrice,
              )}{' '}
              {debtCurrency.symbol}
            </span>
            {value ? (
              <>
                <Arrow />
                <span className="text-green-500">
                  {formatUnits(
                    max(remainingDebt - repayAmount, 0n),
                    debtCurrency.decimals,
                    debtAssetPrice,
                  )}{' '}
                  {debtCurrency.symbol}
                </span>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex gap-3 justify-between sm:justify-start">
          <div className="text-gray-500">LTV</div>
          <div className="flex items-center gap-1">
            <span className="text-green-500">{currentLtv.toFixed(2)}%</span>
            {value ? (
              <>
                <Arrow />
                <span className="text-green-500">
                  {expectedLtv.toFixed(2)}%
                </span>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <ActionButton {...actionButtonProps} />
    </Modal>
  )
}

export default RepayModal
