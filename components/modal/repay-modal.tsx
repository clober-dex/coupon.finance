import React from 'react'

import { formatUnits } from '../../utils/numbers'
import { LoanPosition } from '../../model/loan-position'
import CurrencyAmountInput from '../currency-amount-input'
import { Arrow } from '../svg/arrow'
import SwapSvg from '../svg/swap-svg'
import SlippageSelect from '../slippage-select'
import { fetchCallDataByOdos } from '../../apis/odos'
import Modal from '../../components/modal/modal'
import { Balances } from '../../model/balances'
import { Prices } from '../../model/prices'
import { min } from '../../utils/bigint'

const RepayModal = ({
  onClose,
  setShowSlippageSelect,
  isUseCollateral,
  setIsUseCollateral,
  position,
  value,
  setValue,
  prices,
  repayAmount,
  balances,
  showSlippageSelect,
  slippage,
  setSlippage,
  currentLtv,
  expectedLtv,
  userAddress,
  pathId,
  repayWithCollateral,
  repay,
  amount,
  maxRefund,
  refund,
}: {
  onClose: () => void
  setShowSlippageSelect: React.Dispatch<React.SetStateAction<boolean>>
  isUseCollateral: boolean
  setIsUseCollateral: (isUseCollateral: boolean) => void
  position: LoanPosition
  value: string
  setValue: (value: string) => void
  prices: Prices
  repayAmount: bigint
  balances: Balances
  showSlippageSelect: boolean
  slippage: string
  setSlippage: React.Dispatch<React.SetStateAction<string>>
  currentLtv: string
  expectedLtv: string
  userAddress: `0x${string}` | undefined
  pathId: string | undefined
  repayWithCollateral: (
    position: LoanPosition,
    amount: bigint,
    mightBoughtDebtAmount: bigint,
    expectedProceeds: bigint,
    swapData: `0x${string}`,
  ) => Promise<void>
  repay: (
    position: LoanPosition,
    amount: bigint,
    expectedProceeds: bigint,
  ) => Promise<void>
  amount: bigint
  maxRefund: bigint
  refund: bigint
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
              currency={position.collateral.underlying}
              value={value}
              onValueChange={setValue}
              price={prices[position.collateral.underlying.address]}
              balance={position.collateralAmount}
            />
            <SwapSvg className="w-4 h-4 sm:w-6 sm:h-6 self-center my-3 sm:my-4" />
            <div className="mb-4 font-bold">
              How much would you like to repay
            </div>
            <CurrencyAmountInput
              currency={position.underlying}
              value={formatUnits(repayAmount, position.underlying.decimals)}
              onValueChange={setValue}
              price={prices[position.underlying.address]}
              balance={0n}
              disabled
            />
          </div>
        ) : (
          <>
            <div className="mb-4 font-bold">
              How much would you like to repay?
            </div>
            <CurrencyAmountInput
              currency={position.underlying}
              value={value}
              onValueChange={setValue}
              price={prices[position.underlying.address]}
              balance={min(
                position.amount - maxRefund,
                balances[position.underlying.address],
              )}
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
                position.amount - maxRefund,
                position.underlying.decimals,
                prices[position.underlying.address],
              )}{' '}
              {position.underlying.symbol}
            </span>
            {value ? (
              <>
                <Arrow />
                <span className="text-green-500">
                  {formatUnits(
                    position.amount - maxRefund - repayAmount,
                    position.underlying.decimals,
                    prices[position.underlying.address],
                  )}{' '}
                  {position.underlying.symbol}
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
            <span className="text-green-500">{currentLtv}%</span>
            {value ? (
              <>
                <Arrow />
                <span className="text-green-500">{expectedLtv}%</span>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <button
        disabled={
          repayAmount === 0n ||
          (!isUseCollateral &&
            repayAmount > balances[position.underlying.address]) ||
          repayAmount > position.amount - maxRefund
        }
        className="font-bold text-base sm:text-xl bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 h-12 sm:h-16 rounded-lg text-white disabled:text-gray-300 dark:disabled:text-gray-500"
        onClick={async () => {
          if (!userAddress) {
            return
          }
          if (isUseCollateral && pathId) {
            const swapData = await fetchCallDataByOdos({
              pathId,
              userAddress,
            })
            await repayWithCollateral(
              position,
              amount,
              repayAmount,
              refund,
              swapData,
            )
          } else if (isUseCollateral && !pathId) {
            //TODO: support debt asset and collateral asset are the same
            console.error('not supported same asset')
          } else if (!isUseCollateral) {
            await repay(position, amount, refund)
          }
          setValue('')
          onClose()
        }}
      >
        {repayAmount === 0n
          ? 'Enter amount to repay'
          : !isUseCollateral &&
            repayAmount > balances[position.underlying.address]
          ? `Insufficient ${position.underlying.symbol} balance`
          : repayAmount > position.amount - maxRefund
          ? `Cannot repay more than remaining debt`
          : isUseCollateral
          ? 'Repay with Collateral'
          : 'Repay'}
      </button>
    </Modal>
  )
}

export default RepayModal
