import React, { useCallback } from 'react'
import {
  useAccount,
  useBalance,
  usePublicClient,
  useQuery,
  useQueryClient,
  useWalletClient,
} from 'wagmi'
import { Hash } from 'viem'

import { CONTRACT_ADDRESSES } from '../utils/addresses'
import { DepositController__factory } from '../typechain'
import { Asset } from '../model/asset'
import { max } from '../utils/bigint'
import { permit20 } from '../utils/permit20'
import { fetchBondPositions } from '../api/bond-position'
import { BondPosition } from '../model/bond-position'
import { formatUnits } from '../utils/numbers'
import { permit721 } from '../utils/permit721'
import { Currency } from '../model/currency'

import { isEthereum, useCurrencyContext } from './currency-context'
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
}

const Context = React.createContext<DepositContext>({
  positions: [],
  deposit: () => Promise.resolve(undefined),
  withdraw: () => Promise.resolve(),
})

const SLIPPAGE_PERCENTAGE = 0

export const DepositProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const queryClient = useQueryClient()

  const { address: userAddress } = useAccount()
  const { data: balance } = useBalance({ address: userAddress })

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { setConfirmation } = useTransactionContext()
  const { balances } = useCurrencyContext()

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

      const minimumInterestEarned = min(
        BigInt(
          Math.floor(Number(expectedProceeds) * (1 - SLIPPAGE_PERCENTAGE)),
        ),
        expectedProceeds,
      )
      const wethBalance = isEthereum(asset.underlying)
        ? balances[asset.underlying.address] - (balance?.value || 0n)
        : 0n

      let hash: Hash | undefined
      try {
        const { deadline, r, s, v } = await permit20(
          walletClient,
          asset.underlying,
          walletClient.account.address,
          CONTRACT_ADDRESSES.DepositController,
          amount + minimumInterestEarned, // TODO: change after contract change
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
            ? max(amount - wethBalance, 0n)
            : 0n,
          account: walletClient.account,
        })
        hash = await walletClient.writeContract(request)
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
      balance?.value,
      balances,
      publicClient,
      queryClient,
      setConfirmation,
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

      const maximumInterestPaid = max(
        BigInt(Math.floor(Number(repurchaseFee) * (1 + SLIPPAGE_PERCENTAGE))),
        repurchaseFee,
      )

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
        const { request } = await publicClient.simulateContract({
          address: CONTRACT_ADDRESSES.DepositController,
          abi: DepositController__factory.abi,
          functionName: 'withdraw',
          args: [
            tokenId,
            amount + maximumInterestPaid,
            maximumInterestPaid,
            { deadline, v, r, s },
          ],
          account: walletClient.account,
        })
        await walletClient.writeContract(request)
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
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useDepositContext = () =>
  React.useContext(Context) as DepositContext
