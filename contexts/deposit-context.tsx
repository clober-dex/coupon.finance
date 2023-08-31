import React, { useCallback } from 'react'
import {
  useAccount,
  useBalance,
  usePublicClient,
  useQuery,
  useWalletClient,
} from 'wagmi'

import { CONTRACT_ADDRESSES } from '../utils/addresses'
import { DepositController__factory } from '../typechain'
import { Asset } from '../model/asset'
import { max } from '../utils/bigint'
import { permit20 } from '../utils/permit20'
import { fetchBondPositions } from '../api/bond-position'
import { BondPosition } from '../model/bond-position'
import { formatUnits } from '../utils/numbers'

import { isEthereum, useCurrencyContext } from './currency-context'
import { useTransactionContext } from './transaction-context'

type DepositContext = {
  positions: BondPosition[]
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
  const { address: userAddress } = useAccount()
  const { data: balance } = useBalance({ address: userAddress })

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { setConfirmation } = useTransactionContext()
  const { balances, invalidateBalances } = useCurrencyContext()

  const { data: positions } = useQuery(
    ['bond-positions', userAddress],
    () => (userAddress ? fetchBondPositions(userAddress) : []),
    {
      refetchOnWindowFocus: true,
      initialData: [],
    },
  )

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
      const { deadline, r, s, v } = await permit20(
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
            ? max(amount - wethBalance, 0n)
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
        positions,
        deposit,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useDepositContext = () =>
  React.useContext(Context) as DepositContext
