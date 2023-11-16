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
import { CHAIN_IDS } from '../constants/chain'
import { getDeadlineTimestampInSeconds } from '../utils/date'

import { useCurrencyContext } from './currency-context'
import { useTransactionContext } from './transaction-context'
import { useChainContext } from './chain-context'

type DepositContext = {
  positions: BondPosition[]
  deposit: (
    asset: Asset,
    amount: bigint,
    epochs: number,
    expectedProceeds: bigint,
    pendingPosition?: BondPosition,
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
  const { selectedChain } = useChainContext()

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { setConfirmation } = useTransactionContext()
  const { calculateETHValue, prices } = useCurrencyContext()
  const [pendingPositions, setPendingPositions] = React.useState<
    BondPosition[]
  >([])

  const { data: positions } = useQuery(
    ['bond-positions', userAddress, selectedChain, pendingPositions],
    async () => {
      if (!userAddress) {
        return []
      }
      const confirmationPositions = await fetchBondPositions(
        selectedChain.id,
        userAddress,
      )
      const latestConfirmationTimestamp =
        confirmationPositions.sort((a, b) => b.updatedAt - a.updatedAt).at(0)
          ?.updatedAt ?? 0
      return [
        ...confirmationPositions,
        ...pendingPositions.filter(
          (position) => position.updatedAt > latestConfirmationTimestamp,
        ),
      ]
    },
    {
      refetchIntervalInBackground: true,
      refetchInterval: 5 * 1000,
      initialData: [],
    },
  )

  const deposit = useCallback(
    async (
      asset: Asset,
      amount: bigint,
      epochs: number,
      expectedProceeds: bigint,
      pendingPosition?: BondPosition,
    ): Promise<Hash | undefined> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      let hash: Hash | undefined
      try {
        const ethValue = calculateETHValue(asset.underlying, amount)
        const permitAmount = amount - ethValue
        const { deadline, r, s, v } = await permit20(
          selectedChain.id,
          walletClient,
          asset.underlying,
          walletClient.account.address,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].DepositController,
          permitAmount,
          getDeadlineTimestampInSeconds(),
        )
        setConfirmation({
          title: 'Making Deposit',
          body: 'Please confirm in your wallet.',
          fields: [
            {
              direction: 'in',
              currency: asset.underlying,
              label: asset.underlying.symbol,
              value: formatUnits(
                amount,
                asset.underlying.decimals,
                prices[asset.underlying.address],
              ),
            },
          ],
        })
        hash = await writeContract(publicClient, walletClient, {
          address:
            CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].DepositController,
          abi: DepositController__factory.abi,
          functionName: 'deposit',
          args: [
            asset.substitutes[0].address,
            amount + expectedProceeds,
            epochs,
            expectedProceeds,
            {
              permitAmount,
              signature: {
                deadline,
                v,
                r,
                s,
              },
            },
          ],
          value: ethValue,
          account: walletClient.account,
        })
        setPendingPositions(
          (prevState) =>
            [
              ...(pendingPosition ? [pendingPosition] : []),
              ...prevState,
            ] as BondPosition[],
        )
        await queryClient.invalidateQueries(['bond-positions'])
      } catch (e) {
        setPendingPositions([])
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
      return hash
    },
    [
      walletClient,
      selectedChain.id,
      calculateETHValue,
      setConfirmation,
      prices,
      publicClient,
      queryClient,
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
          selectedChain.id,
          walletClient,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BondPositionManager,
          tokenId,
          walletClient.account.address,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].DepositController,
          getDeadlineTimestampInSeconds(),
        )
        setConfirmation({
          title: 'Making Withdrawal',
          body: 'Please confirm in your wallet.',
          fields: [
            {
              direction: 'out',
              currency: asset,
              label: asset.symbol,
              value: formatUnits(amount, asset.decimals, prices[asset.address]),
            },
          ],
        })
        await writeContract(publicClient, walletClient, {
          address:
            CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].DepositController,
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
    [walletClient, selectedChain.id, setConfirmation, prices, publicClient],
  )

  const collect = useCallback(
    async (asset: Currency, tokenId: bigint, amount: bigint) => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        const { deadline, r, s, v } = await permit721(
          selectedChain.id,
          walletClient,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BondPositionManager,
          tokenId,
          walletClient.account.address,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].DepositController,
          getDeadlineTimestampInSeconds(),
        )
        setConfirmation({
          title: 'Collecting',
          body: 'Please confirm in your wallet.',
          fields: [
            {
              direction: 'out',
              currency: asset,
              label: asset.symbol,
              value: formatUnits(amount, asset.decimals, prices[asset.address]),
            },
          ],
        })
        await writeContract(publicClient, walletClient, {
          address:
            CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].DepositController,
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
    [walletClient, selectedChain.id, setConfirmation, prices, publicClient],
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
