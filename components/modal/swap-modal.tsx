import React from 'react'

import { Currency } from '../../model/currency'
import { Prices } from '../../model/prices'
import { ActionButtonProps } from '../button/action-button'
import { SwapForm } from '../form/swap-form'
import { Balances } from '../../model/balances'

import Modal from './modal'

export const SwapModal = ({
  onClose,
  currencies,
  prices,
  balances,
  showInputCurrencySelect,
  setShowInputCurrencySelect,
  inputCurrency,
  setInputCurrency,
  inputCurrencyAmount,
  setInputCurrencyAmount,
  availableInputCurrencyBalance,
  showOutputCurrencySelect,
  setShowOutputCurrencySelect,
  outputCurrency,
  setOutputCurrency,
  outputCurrencyAmount,
  showSlippageSelect,
  setShowSlippageSelect,
  slippage,
  setSlippage,
  gasEstimateValue,
  actionButtonProps,
}: {
  onClose: () => void
  currencies: Currency[]
  prices: Prices
  balances: Balances
  showInputCurrencySelect: boolean
  setShowInputCurrencySelect: (showInputCurrencySelect: boolean) => void
  inputCurrency: Currency | undefined
  setInputCurrency: (inputCurrency: Currency | undefined) => void
  inputCurrencyAmount: string
  setInputCurrencyAmount: (inputCurrencyAmount: string) => void
  availableInputCurrencyBalance: bigint
  showOutputCurrencySelect: boolean
  setShowOutputCurrencySelect: (showOutputCurrencySelect: boolean) => void
  outputCurrency: Currency | undefined
  setOutputCurrency: (outputCurrency: Currency | undefined) => void
  outputCurrencyAmount: string
  showSlippageSelect?: boolean
  setShowSlippageSelect?: React.Dispatch<React.SetStateAction<boolean>>
  slippage?: string
  setSlippage?: React.Dispatch<React.SetStateAction<string>>
  gasEstimateValue?: number
  actionButtonProps: ActionButtonProps
}) => {
  return (
    <Modal
      show
      onClose={() => {
        onClose()
      }}
    >
      <SwapForm
        currencies={currencies}
        prices={prices}
        balances={balances}
        showInputCurrencySelect={showInputCurrencySelect}
        setShowInputCurrencySelect={setShowInputCurrencySelect}
        inputCurrency={inputCurrency}
        setInputCurrency={setInputCurrency}
        inputCurrencyAmount={inputCurrencyAmount}
        setInputCurrencyAmount={setInputCurrencyAmount}
        availableInputCurrencyBalance={availableInputCurrencyBalance}
        showOutputCurrencySelect={showOutputCurrencySelect}
        setShowOutputCurrencySelect={setShowOutputCurrencySelect}
        outputCurrency={outputCurrency}
        setOutputCurrency={setOutputCurrency}
        outputCurrencyAmount={outputCurrencyAmount}
        actionButtonProps={actionButtonProps}
        showSlippageSelect={showSlippageSelect}
        setShowSlippageSelect={setShowSlippageSelect}
        slippage={slippage}
        setSlippage={setSlippage}
        gasEstimateValue={gasEstimateValue}
      />
    </Modal>
  )
}
