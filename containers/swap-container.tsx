import React, { useState } from 'react'

import { SwapButton } from '../components/button/swap-button'
import { SwapModal } from '../components/modal/swap-modal'
import { Currency } from '../model/currency'
import { useCurrencyContext } from '../contexts/currency-context'

const SwapContainer = () => {
  const { prices, balances } = useCurrencyContext()

  const [showSwapModal, setShowSwapModal] = useState(false)
  const [inputCurrency, setInputCurrency] = useState<Currency | undefined>(
    undefined,
  )
  const [inputCurrencyAmount, setInputCurrencyAmount] = useState('')
  const [outputCurrency, setOutputCurrency] = useState<Currency | undefined>(
    undefined,
  )

  const [showInputCurrencySelect, setShowInputCurrencySelect] = useState(false)
  const [showOutputCurrencySelect, setShowOutputCurrencySelect] =
    useState(false)

  return (
    <>
      <SwapButton setShowSwapModal={setShowSwapModal} />
      {showSwapModal ? (
        <SwapModal
          onClose={() => {
            setShowSwapModal(false)
          }}
          currencies={[
            {
              address: '0x0000000000000000000000000000000000000001',
              name: 'USDC',
              symbol: 'USDC',
              decimals: 6,
            },
            {
              address: '0x0000000000000000000000000000000000000002',
              name: 'WBTC',
              symbol: 'WBTC',
              decimals: 8,
            },
            {
              address: '0x0000000000000000000000000000000000000003',
              name: 'WETH',
              symbol: 'WETH',
              decimals: 18,
            },
            {
              address: '0x0000000000000000000000000000000000000004',
              name: 'USDT',
              symbol: 'USDT',
              decimals: 6,
            },
            {
              address: '0x0000000000000000000000000000000000000005',
              name: 'DAI',
              symbol: 'DAI',
              decimals: 18,
            },
          ]}
          prices={prices}
          balances={balances}
          showInputCurrencySelect={showInputCurrencySelect}
          setShowInputCurrencySelect={setShowInputCurrencySelect}
          inputCurrency={inputCurrency}
          setInputCurrency={setInputCurrency}
          inputCurrencyAmount={inputCurrencyAmount}
          setInputCurrencyAmount={setInputCurrencyAmount}
          availableInputCurrencyBalance={0n}
          showOutputCurrencySelect={showOutputCurrencySelect}
          setShowOutputCurrencySelect={setShowOutputCurrencySelect}
          outputCurrency={outputCurrency}
          setOutputCurrency={setOutputCurrency}
          outputCurrencyAmount={'1'}
          actionButtonProps={{
            disabled: false,
            text: 'Swap',
            onClick: () => {},
          }}
        />
      ) : (
        <></>
      )}
    </>
  )
}

export default SwapContainer
