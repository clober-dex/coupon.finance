import React, { useCallback } from 'react'
import { useAccount, useBalance, usePublicClient, useWalletClient } from 'wagmi'

import { Currency } from '../model/currency'
import { CONTRACT_ADDRESSES } from '../utils/addresses'
import { DepositController__factory } from '../typechain'
import { Asset } from '../model/asset'
import { bigIntMax } from '../utils/bigint'
import { permit } from '../utils/permit'
import { formatUnits } from '../utils/numbers'

import { isEthereum, useCurrencyContext } from './currency-context'
import { useTransactionContext } from './transaction-context'

type DepositContext = {
  // TODO: change to bigInt
  positions: {
    currency: Currency
    apy: string
    interestEarned: string
    deposited: string
    expiry: string
    price: string
  }[]
  deposit: (
    asset: Asset,
    amount: bigint,
    epochs: number,
    expectedProceeds: bigint,
  ) => Promise<void>
}

const Context = React.createContext<DepositContext>({
  positions: [],
  deposit: () => Promise.resolve(),
})

const SLIPPAGE_PERCENTAGE = 0

export const DepositProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const dummyPositions = [
    {
      currency: {
        address: '0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9' as `0x${string}`,
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
      apy: '5.00%',
      interestEarned: '3.45',
      deposited: '69.00',
      expiry: '12/12/2021',
      price: '2000.00',
    },
    {
      currency: {
        address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' as `0x${string}`,
        name: 'Arbitrum',
        symbol: 'ARB',
        decimals: 18,
      },
      apy: '5.00%',
      interestEarned: '2.1',
      deposited: '42.00',
      expiry: '12/12/2021',
      price: '30000.00',
    },
  ]

  const { address: userAddress } = useAccount()
  const { data: balance } = useBalance({ address: userAddress })

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { setConfirmation } = useTransactionContext()
  const { balances, invalidateBalances } = useCurrencyContext()

  const deposit = useCallback(
    async (
      asset: Asset,
      amount: bigint,
      epochs: number,
      expectedProceeds: bigint,
    ) => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      const minimumInterestEarned = BigInt(
        Math.floor(Number(expectedProceeds) * (1 - SLIPPAGE_PERCENTAGE)),
      )
      const wethBalance = isEthereum(asset.underlying)
        ? balances[asset.underlying.address] - (balance?.value || 0n)
        : 0n
      const { deadline, r, s, v } = await permit(
        walletClient,
        asset.underlying,
        walletClient.account.address,
        CONTRACT_ADDRESSES.DepositController,
        amount + minimumInterestEarned, // TODO: change after contract change
        BigInt(Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24)),
      )

      try {
        setConfirmation({
          title: 'Making Deposit',
          body: 'Please confirm in your wallet.',
          fields: [
            {
              currency: asset.underlying,
              label: asset.underlying.symbol,
              value: formatUnits(amount, asset.underlying.decimals),
            },
          ],
        })
        const { request } = await publicClient.simulateContract({
          address: CONTRACT_ADDRESSES.DepositController,
          abi: DepositController__factory.abi,
          functionName: 'deposit',
          args: [
            asset.substitutes[0].address,
            amount + minimumInterestEarned,
            epochs,
            minimumInterestEarned,
            { deadline, v, r, s },
          ],
          value: isEthereum(asset.underlying)
            ? bigIntMax(amount - wethBalance, 0n)
            : 0n,
          account: walletClient.account,
        })
        await walletClient.writeContract(request)
      } catch (e) {
        console.error(e)
      } finally {
        invalidateBalances()
        setConfirmation(undefined)
      }
    },
    [
      balance?.value,
      balances,
      invalidateBalances,
      publicClient,
      setConfirmation,
      walletClient,
    ],
  )

  return (
    <Context.Provider
      value={{
        positions: dummyPositions,
        deposit,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useDepositContext = () =>
  React.useContext(Context) as DepositContext
