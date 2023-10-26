import React, { useCallback } from 'react'
import {
  useAccount,
  usePublicClient,
  useQuery,
  useQueryClient,
  useWalletClient,
} from 'wagmi'
import { Hash } from 'viem'

import { CONTRACT_ADDRESSES } from '../constants/addresses'
import { DepositController__factory } from '../typechain'
import { Asset } from '../model/asset'
import { permit20 } from '../utils/permit20'
import { fetchBondPositions } from '../apis/bond-position'
import { BondPosition } from '../model/bond-position'
import { formatUnits } from '../utils/numbers'
import { permit721 } from '../utils/permit721'
import { Currency } from '../model/currency'
import { writeContract } from '../utils/wallet'

import { useCurrencyContext } from './currency-context'
import { useTransactionContext } from './transaction-context'

type DepositContext = {
  positions: BondPosition[]
  deposit: (
    asset: Asset,
    amount: bigint,
    epochs: number,
    expectedProceeds: bigint,
  ) => Promise<Hash | undefined>
  withdraw: (
    asset: Currency,
    tokenId: bigint,
    amount: bigint,
    repurchaseFee: bigint,
  ) => Promise<void>
  collect: (asset: Currency, tokenId: bigint, amount: bigint) => Promise<void>
}

const Context = React.createContext<DepositContext>({
  positions: [],
  deposit: () => Promise.resolve(undefined),
  withdraw: () => Promise.resolve(),
  collect: () => Promise.resolve(),
})

export const DepositProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const queryClient = useQueryClient()

  const { address: userAddress } = useAccount()

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { setConfirmation } = useTransactionContext()
  const { calculateETHValue } = useCurrencyContext()

  const { data: positions } = useQuery(
    ['bond-positions', userAddress],
    () => (userAddress ? fetchBondPositions(userAddress) : []),
    {
      refetchOnWindowFocus: true,
      refetchInterval: 2 * 1000,
      initialData: [],
    },
  )

  const deposit = useCallback(
    async (
      asset: Asset,
      amount: bigint,
      epochs: number,
      expectedProceeds: bigint,
    ): Promise<Hash | undefined> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      let hash: Hash | undefined
      try {
        const { deadline, r, s, v } = await permit20(
          walletClient,
          asset.underlying,
          walletClient.account.address,
          CONTRACT_ADDRESSES.DepositController,
          amount,
          BigInt(Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24)),
        )
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
        hash = await writeContract(publicClient, walletClient, {
          address: CONTRACT_ADDRESSES.DepositController,
          abi: DepositController__factory.abi,
          functionName: 'deposit',
          args: [
            asset.substitutes[0].address,
            amount + expectedProceeds,
            epochs,
            expectedProceeds,
            {
              permitAmount: amount,
              signature: {
                deadline,
                v,
                r,
                s,
              },
            },
          ],
          value: calculateETHValue(asset.underlying, amount),
          account: walletClient.account,
        })
        await queryClient.invalidateQueries(['bond-positions'])
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
      return hash
    },
    [
      publicClient,
      queryClient,
      setConfirmation,
      calculateETHValue,
      walletClient,
    ],
  )

  const withdraw = useCallback(
    async (
      asset: Currency,
      tokenId: bigint,
      amount: bigint,
      repurchaseFee: bigint,
    ) => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        const { deadline, r, s, v } = await permit721(
          walletClient,
          CONTRACT_ADDRESSES.BondPositionManager,
          tokenId,
          walletClient.account.address,
          CONTRACT_ADDRESSES.DepositController,
          BigInt(Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24)),
        )
        setConfirmation({
          title: 'Making Withdrawal',
          body: 'Please confirm in your wallet.',
          fields: [
            {
              currency: asset,
              label: asset.symbol,
              value: formatUnits(amount, asset.decimals),
            },
          ],
        })
        await writeContract(publicClient, walletClient, {
          address: CONTRACT_ADDRESSES.DepositController,
          abi: DepositController__factory.abi,
          functionName: 'withdraw',
          args: [
            tokenId,
            amount + repurchaseFee,
            repurchaseFee,
            { deadline, v, r, s },
          ],
          account: walletClient.account,
        })
      } catch (e) {
        console.error(e)
      } finally {
        setConfirmation(undefined)
      }
    },
    [publicClient, setConfirmation, walletClient],
  )

  const collect = useCallback(
    async (asset: Currency, tokenId: bigint, amount: bigint) => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        const { deadline, r, s, v } = await permit721(
          walletClient,
          CONTRACT_ADDRESSES.BondPositionManager,
          tokenId,
          walletClient.account.address,
          CONTRACT_ADDRESSES.DepositController,
          BigInt(Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24)),
        )
        setConfirmation({
          title: 'Collecting',
          body: 'Please confirm in your wallet.',
          fields: [
            {
              currency: asset,
              label: asset.symbol,
              value: formatUnits(amount, asset.decimals),
            },
          ],
        })
        await writeContract(publicClient, walletClient, {
          address: CONTRACT_ADDRESSES.DepositController,
          abi: DepositController__factory.abi,
          functionName: 'collect',
          args: [tokenId, { deadline, v, r, s }],
          account: walletClient.account,
        })
      } catch (e) {
        console.error(e)
      } finally {
        setConfirmation(undefined)
      }
    },
    [publicClient, setConfirmation, walletClient],
  )

  return (
    <Context.Provider
      value={{
        positions,
        deposit,
        withdraw,
        collect,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useDepositContext = () =>
  React.useContext(Context) as DepositContext
