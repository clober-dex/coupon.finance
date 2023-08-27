import React, { useCallback } from 'react'
import { useAccount, useBalance, usePublicClient, useWalletClient } from 'wagmi'
import { formatUnits } from 'viem'

import { Currency } from '../model/currency'
import { CONTRACT_ADDRESSES } from '../utils/addresses'
import { DepositController__factory } from '../typechain'
import { Asset } from '../model/asset'

import { isEthereum, useCurrencyContext } from './currency-context'
import { useTransactionContext } from './transaction-context'
import { usePermitContext } from './permit-context'

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
  apy: { [key in `0x${string}`]: number }
  available: { [key in `0x${string}`]: bigint }
  deposited: { [key in `0x${string}`]: bigint }
  deposit: (
    asset: Asset,
    amount: bigint,
    epochs: number,
    expectedProceeds: bigint,
    slippage: number,
  ) => Promise<void>
}

const Context = React.createContext<DepositContext>({
  positions: [],
  apy: {},
  available: {},
  deposited: {},
  deposit: () => Promise.resolve(),
})

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

  // TODO: get apy from order book
  const apy: {
    [key in `0x${string}`]: number
  } = {}

  // TODO: get available
  const available: {
    [key in `0x${string}`]: bigint
  } = {}

  // TODO: get deposited
  const deposited: {
    [key in `0x${string}`]: bigint
  } = {}

  const { address: userAddress } = useAccount()
  const { data: balance } = useBalance({ address: userAddress })

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { setConfirmation } = useTransactionContext()
  const { balances } = useCurrencyContext()
  const { permit } = usePermitContext()

  const deposit = useCallback(
    async (
      asset: Asset,
      amount: bigint,
      epochs: number,
      expectedProceeds: bigint,
      slippage: number,
    ) => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      const minimumInterestEarned = BigInt(
        Math.floor(Number(expectedProceeds) * (1 - slippage / 100)),
      )
      const wethBalance = isEthereum(asset.underlying)
        ? balances[asset.underlying.address] - (balance?.value || 0n)
        : 0n

      const deadline = BigInt(
        Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24),
      )

      const { r, s, v } = await permit(
        asset.underlying,
        walletClient.account.address,
        CONTRACT_ADDRESSES.DepositController,
        isEthereum(asset.underlying)
          ? wethBalance >= amount
            ? amount
            : wethBalance
          : amount,
        deadline,
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
        // const { request } = await publicClient.simulateContract({
        //   address: CONTRACT_ADDRESSES.DepositController,
        //   abi: DepositController__factory.abi,
        //   functionName: 'deposit',
        //   args: [
        //     asset.substitutes[0].address,
        //     amount,
        //     epochs,
        //     minimumInterestEarned,
        //     { deadline, v, r, s },
        //   ],
        //   value: isEthereum(asset.underlying)
        //     ? wethBalance >= amount
        //       ? amount
        //       : wethBalance
        //     : 0n,
        //   account: walletClient.account,
        // })
        // await walletClient.writeContract(request)

        await walletClient.writeContract({
          address: CONTRACT_ADDRESSES.DepositController,
          abi: DepositController__factory.abi,
          functionName: 'deposit',
          args: [
            asset.substitutes[0].address,
            amount,
            epochs,
            minimumInterestEarned,
            { deadline, v, r, s },
          ],
          value: isEthereum(asset.underlying)
            ? wethBalance >= amount
              ? amount
              : wethBalance
            : 0n,
          account: walletClient.account,
          gas: 10000000n,
        })
      } catch (e) {
        console.error(e)
      } finally {
        setConfirmation(undefined)
      }
    },
    [
      balance?.value,
      balances,
      permit,
      publicClient,
      setConfirmation,
      walletClient,
    ],
  )

  return (
    <Context.Provider
      value={{
        positions: dummyPositions,
        apy,
        available,
        deposited,
        deposit,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useDepositContext = () =>
  React.useContext(Context) as DepositContext
