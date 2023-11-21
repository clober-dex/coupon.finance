import React, { useCallback } from 'react'
import { isAddressEqual, zeroAddress } from 'viem'
import {
  useAccount,
  usePublicClient,
  useQuery,
  useQueryClient,
  useWalletClient,
} from 'wagmi'

import { Currency } from '../model/currency'
import { Transaction } from '../model/transaction'
import { formatUnits } from '../utils/numbers'
import { approve20 } from '../utils/approve20'
import {
  fetchBalancesByOdos,
  fetchCurrenciesByOdos,
  fetchPricesByOdos,
} from '../apis/odos'
import { Prices } from '../model/prices'
import { Balances } from '../model/balances'

import { useTransactionContext } from './transaction-context'
import { useChainContext } from './chain-context'

type SwapContext = {
  swap: (
    inputCurrency: Currency,
    outputCurrency: Currency,
    amountIn: bigint,
    expectedAmountOut: bigint,
    transaction: Transaction,
  ) => Promise<void>
  prices: Prices
  balances: Balances
  currencies: Currency[]
}

const Context = React.createContext<SwapContext>({
  swap: () => Promise.resolve(),
  prices: {},
  balances: {},
  currencies: [],
})

export const SwapProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const queryClient = useQueryClient()

  const { selectedChain } = useChainContext()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { address: userAddress } = useAccount()
  const { setConfirmation } = useTransactionContext()

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

  const swap = useCallback(
    async (
      inputCurrency: Currency,
      outputCurrency: Currency,
      amountIn: bigint,
      expectedAmountOut: bigint,
      transaction: Transaction,
    ) => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        if (!isAddressEqual(inputCurrency.address, zeroAddress)) {
          setConfirmation({
            title: 'Approve',
            body: 'Please confirm in your wallet.',
            fields: [
              {
                currency: inputCurrency,
                label: inputCurrency.symbol,
                value: formatUnits(
                  amountIn,
                  inputCurrency.decimals,
                  prices[inputCurrency.address],
                ),
              },
            ],
          })
          const hash = await approve20(
            selectedChain.id,
            walletClient,
            inputCurrency,
            transaction.from,
            transaction.to,
            amountIn,
          )
          if (hash) {
            await publicClient.waitForTransactionReceipt({
              hash,
            })
          }
        }

        setConfirmation({
          title: 'Swap',
          body: 'Please confirm in your wallet.',
          fields: [
            {
              direction: 'in',
              currency: inputCurrency,
              label: inputCurrency.symbol,
              value: formatUnits(
                amountIn,
                inputCurrency.decimals,
                prices[inputCurrency.address],
              ),
            },
            {
              direction: 'out',
              currency: outputCurrency,
              label: outputCurrency.symbol,
              value: formatUnits(
                expectedAmountOut,
                outputCurrency.decimals,
                prices[outputCurrency.address],
              ),
            },
          ],
        })
        await publicClient.waitForTransactionReceipt({
          hash: await walletClient.sendTransaction({
            data: transaction.data,
            to: transaction.to,
            value: transaction.value,
            gas: transaction.gasLimit,
          }),
        })
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['swap-balances'])
        setConfirmation(undefined)
      }
    },
    [
      prices,
      publicClient,
      queryClient,
      selectedChain.id,
      setConfirmation,
      walletClient,
    ],
  )

  return (
    <Context.Provider
      value={{
        swap,
        prices: prices ?? {},
        balances: balances ?? {},
        currencies: currencies ?? [],
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useSwapContext = () => React.useContext(Context) as SwapContext
