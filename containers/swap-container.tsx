import React, { useState } from 'react'
import { useAccount, useFeeData, useQuery } from 'wagmi'
import { isAddressEqual, zeroAddress } from 'viem'

import { SwapButton } from '../components/button/swap-button'
import { Currency } from '../model/currency'
import { useChainContext } from '../contexts/chain-context'
import {
  fetchAmountOutByOdos,
  fetchBalancesByOdos,
  fetchCurrenciesByOdos,
  fetchPricesByOdos,
} from '../apis/odos'
import { Balances } from '../model/balances'
import { Prices } from '../model/prices'
import Modal from '../components/modal/modal'
import { SwapForm } from '../components/form/swap-form'
import { useCurrencyContext } from '../contexts/currency-context'
import { formatUnits, parseUnits } from '../utils/numbers'
import { toWrapETH } from '../utils/currency'

const SwapContainer = () => {
  const { data: feeData } = useFeeData()
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
  const [slippage, setSlippage] = useState('1')
  const [showSlippageSelect, setShowSlippageSelect] = useState(false)

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

  const {
    data: { amountOut, pathId, gasLimit, pathViz },
  } = useQuery(
    [
      'odos-swap-simulate',
      inputCurrency?.address,
      outputCurrency?.address,
      inputCurrencyAmount,
    ],
    async () => {
      const amount = parseUnits(
        inputCurrencyAmount,
        inputCurrency?.decimals ?? 18,
      )
      if (
        feeData?.gasPrice &&
        userAddress &&
        selectedChain &&
        inputCurrency &&
        outputCurrency &&
        amount > 0n
      ) {
        const { amountOut, pathId, gasLimit, pathViz } =
          await fetchAmountOutByOdos({
            chainId: selectedChain.id,
            amountIn: amount.toString(),
            tokenIn: inputCurrency.address,
            tokenOut: outputCurrency.address,
            slippageLimitPercent: Number(slippage),
            userAddress,
            gasPrice: Number(feeData.gasPrice),
          })
        return {
          amountOut,
          pathId,
          gasLimit,
          pathViz,
        }
      }
      return {
        amountOut: 0n,
        pathId: undefined,
        gasLimit: 0n,
      }
    },
    {
      refetchInterval: 5 * 1000,
      keepPreviousData: true,
      initialData: {
        amountOut: 0n,
        pathId: undefined,
        gasLimit: 0n,
      },
    },
  )

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
              ...[
                ...assets.map((asset) => asset.underlying),
                ...assets
                  .map((asset) => asset.collaterals)
                  .flat()
                  .map((collateral) => collateral.underlying),
              ]
                .filter(
                  (currency, index, self) =>
                    self.findIndex((c) =>
                      isAddressEqual(c.address, currency.address),
                    ) === index,
                )
                .map((currency) => toWrapETH(currency)),
              {
                address: zeroAddress,
                ...selectedChain.nativeCurrency,
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
            availableInputCurrencyBalance={
              inputCurrency ? balances[inputCurrency.address] : 0n
            }
            showOutputCurrencySelect={showOutputCurrencySelect}
            setShowOutputCurrencySelect={setShowOutputCurrencySelect}
            outputCurrency={outputCurrency}
            setOutputCurrency={setOutputCurrency}
            outputCurrencyAmount={
              outputCurrency && amountOut > 0n
                ? formatUnits(amountOut, outputCurrency.decimals)
                : ''
            }
            showSlippageSelect={showSlippageSelect}
            setShowSlippageSelect={setShowSlippageSelect}
            slippage={slippage}
            setSlippage={setSlippage}
            gasEstimateValue={
              parseFloat(
                formatUnits(
                  BigInt(gasLimit ?? 0n) * BigInt(feeData?.gasPrice ?? 0n),
                  selectedChain.nativeCurrency.decimals,
                ),
              ) *
              parseFloat(
                formatUnits(
                  prices[zeroAddress].value,
                  prices[zeroAddress].decimals,
                ),
              )
            }
            pathVizData={pathViz}
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
