import React, { useState } from 'react'
import { useAccount, useQuery } from 'wagmi'
import { isAddressEqual } from 'viem'

import { SwapButton } from '../components/button/swap-button'
import { Currency } from '../model/currency'
import { useChainContext } from '../contexts/chain-context'
import {
  fetchBalancesByOdos,
  fetchCurrenciesByOdos,
  fetchPricesByOdos,
} from '../apis/odos'
import { Balances } from '../model/balances'
import { Prices } from '../model/prices'
import Modal from '../components/modal/modal'
import { SwapForm } from '../components/form/swap-form'
import { useCurrencyContext } from '../contexts/currency-context'

const SwapContainer = () => {
  const { assets } = useCurrencyContext()
  const { address: userAddress } = useAccount()
  const { selectedChain } = useChainContext()

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

  const { data: currencies } = useQuery(
    ['swap-currencies', selectedChain],
    async () =>
      fetchCurrenciesByOdos({
        chainId: selectedChain.id,
      }),
    {
      initialData: [],
    },
  )

  const { data: prices } = useQuery(
    ['swap-prices', selectedChain],
    async () => {
      return fetchPricesByOdos({
        chainId: selectedChain.id,
      })
    },
    {
      initialData: {} as Prices,
      refetchInterval: 10 * 1000,
      refetchIntervalInBackground: true,
    },
  )

  const { data: balances } = useQuery(
    ['swap-balances', selectedChain, userAddress],
    async () => {
      return userAddress
        ? fetchBalancesByOdos({
            chainId: selectedChain.id,
            userAddress,
          })
        : []
    },
    {
      initialData: [],
      refetchInterval: 10 * 1000,
      refetchIntervalInBackground: true,
    },
  ) as {
    data: Balances
  }

  return (
    <>
      <SwapButton setShowSwapModal={setShowSwapModal} />
      {showSwapModal ? (
        <Modal
          show
          onClose={() => {
            setShowSwapModal(false)
          }}
        >
          <SwapForm
            inputCurrencies={currencies}
            outputCurrencies={[
              ...assets.map((asset) => asset.underlying),
              ...assets
                .map((asset) => asset.collaterals)
                .flat()
                .map((collateral) => collateral.underlying),
            ].filter(
              (currency, index, self) =>
                self.findIndex((c) =>
                  isAddressEqual(c.address, currency.address),
                ) === index,
            )}
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
        </Modal>
      ) : (
        <></>
      )}
    </>
  )
}

export default SwapContainer
