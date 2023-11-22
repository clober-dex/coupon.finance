import React, { useMemo, useState } from 'react'
import { useAccount, useFeeData, useQuery } from 'wagmi'
import { isAddressEqual, zeroAddress } from 'viem'

import { SwapButton } from '../components/button/swap-button'
import { Currency } from '../model/currency'
import { useChainContext } from '../contexts/chain-context'
import { fetchAmountOutByOdos, fetchCallDataByOdos } from '../apis/odos'
import Modal from '../components/modal/modal'
import { SwapForm } from '../components/form/swap-form'
import { useCurrencyContext } from '../contexts/currency-context'
import { formatUnits, parseUnits } from '../utils/numbers'
import { toWrapETH } from '../utils/currency'
import { useSwapContext } from '../contexts/swap-context'

const SwapContainer = () => {
  const { swap, prices, currencies, balances } = useSwapContext()
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

  const [amountIn, availableInputCurrencyBalance] = useMemo(
    () => [
      inputCurrency
        ? parseUnits(inputCurrencyAmount, inputCurrency.decimals)
        : 0n,
      inputCurrency ? balances[inputCurrency.address] ?? 0n : 0n,
    ],
    [inputCurrency, inputCurrencyAmount, balances],
  )

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
      refetchIntervalInBackground: true,
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
            availableInputCurrencyBalance={availableInputCurrencyBalance}
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
              disabled:
                !inputCurrency ||
                !outputCurrency ||
                amountOut === 0n ||
                !pathId ||
                !userAddress ||
                (userAddress && amountIn > availableInputCurrencyBalance),
              text:
                userAddress && amountIn > availableInputCurrencyBalance
                  ? `Insufficient ${inputCurrency?.symbol}`
                  : 'Swap',
              onClick: async () => {
                if (
                  !userAddress ||
                  !pathId ||
                  !inputCurrency ||
                  !outputCurrency
                ) {
                  return
                }
                const transaction = await fetchCallDataByOdos({
                  pathId,
                  userAddress,
                })
                await swap(
                  inputCurrency,
                  outputCurrency,
                  amountIn,
                  amountOut,
                  transaction,
                )
              },
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
