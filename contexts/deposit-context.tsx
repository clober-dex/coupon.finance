import React, { useCallback, useMemo } from 'react'
import { usePublicClient, useQueryClient, useWalletClient } from 'wagmi'
import { Hash, zeroAddress } from 'viem'

import { CONTRACT_ADDRESSES } from '../constants/addresses'
import { Asset } from '../model/asset'
import { dummyPermit20Params, permit20 } from '../utils/permit20'
import { extractBondPositions } from '../apis/bond-position'
import { BondPosition } from '../model/bond-position'
import { formatUnits } from '../utils/numbers'
import { permit721 } from '../utils/permit721'
import { writeContract } from '../utils/wallet'
import { CHAIN_IDS } from '../constants/chain'
import { getDeadlineTimestampInSeconds } from '../utils/date'
import { toWrapETH } from '../utils/currency'
import { DEPOSIT_CONTROLLER_ABI } from '../abis/periphery/deposit-controller-abi'

import { useCurrencyContext } from './currency-context'
import { useTransactionContext } from './transaction-context'
import { useChainContext } from './chain-context'
import { useSubgraphContext } from './subgraph-context'

export type DepositContext = {
  positions: BondPosition[]
  deposit: (
    asset: Asset,
    amount: bigint,
    epochs: number,
    expectedProceeds: bigint,
    pendingPosition?: BondPosition,
  ) => Promise<Hash | undefined>
  withdraw: (
    position: BondPosition,
    amount: bigint,
    repurchaseFee: bigint,
  ) => Promise<void>
  collect: (position: BondPosition) => Promise<void>
}

const Context = React.createContext<DepositContext>({
  positions: [],
  deposit: () => Promise.resolve(undefined),
  withdraw: () => Promise.resolve(),
  collect: () => Promise.resolve(),
})

export const DepositProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const queryClient = useQueryClient()

  const { selectedChain } = useChainContext()

  const { integratedPositions } = useSubgraphContext()

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { setConfirmation } = useTransactionContext()
  const { calculateETHValue, prices } = useCurrencyContext()
  const [pendingPositions, setPendingPositions] = React.useState<
    BondPosition[]
  >([])

  const positions = useMemo(() => {
    if (!integratedPositions) {
      return []
    }
    const confirmationPositions = extractBondPositions(integratedPositions)
    const latestConfirmationTimestamp =
      confirmationPositions.sort((a, b) => b.updatedAt - a.updatedAt).at(0)
        ?.updatedAt ?? 0
    return [
      ...confirmationPositions,
      ...pendingPositions.filter(
        (position) => position.updatedAt > latestConfirmationTimestamp,
      ),
    ]
  }, [integratedPositions, pendingPositions])

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
              currency: toWrapETH(asset.underlying),
              label: toWrapETH(asset.underlying).symbol,
              value: formatUnits(
                permitAmount,
                asset.underlying.decimals,
                prices[asset.underlying.address],
              ),
            },
            {
              direction: 'in',
              currency: {
                address: zeroAddress,
                ...selectedChain.nativeCurrency,
              },
              label: selectedChain.nativeCurrency.symbol,
              value: formatUnits(
                ethValue,
                selectedChain.nativeCurrency.decimals,
                prices[asset.underlying.address],
              ),
            },
          ],
        })
        hash = await writeContract(publicClient, walletClient, {
          address:
            CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].DepositController,
          abi: DEPOSIT_CONTROLLER_ABI,
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
      calculateETHValue,
      selectedChain.id,
      selectedChain.nativeCurrency,
      setConfirmation,
      prices,
      publicClient,
      queryClient,
    ],
  )

  const adjust = useCallback(
    async ({
      position,
      newAmount,
      expectedInterest,
    }: {
      position: BondPosition
      newAmount: bigint
      expectedInterest: bigint
    }) => {
      if (!walletClient) {
        return
      }

      const { deadline, r, s, v } = await permit721(
        selectedChain.id,
        walletClient,
        CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BondPositionManager,
        position.tokenId,
        walletClient.account.address,
        CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].DepositController,
        getDeadlineTimestampInSeconds(),
      )
      await writeContract(publicClient, walletClient, {
        address:
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].DepositController,
        abi: DEPOSIT_CONTROLLER_ABI,
        functionName: 'adjust',
        args: [
          position.tokenId,
          newAmount,
          position.toEpoch.id,
          expectedInterest,
          dummyPermit20Params,
          { deadline, v, r, s },
        ],
        account: walletClient.account,
      })
    },
    [walletClient, selectedChain.id, publicClient],
  )

  const withdraw = useCallback(
    async (position: BondPosition, amount: bigint, repurchaseFee: bigint) => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        setConfirmation({
          title: 'Making Withdrawal',
          body: 'Please confirm in your wallet.',
          fields: [
            {
              direction: 'out',
              currency: position.underlying,
              label: position.underlying.symbol,
              value: formatUnits(
                amount,
                position.underlying.decimals,
                prices[position.underlying.address],
              ),
            },
          ],
        })
        await adjust({
          position,
          newAmount: position.amount - amount - repurchaseFee,
          expectedInterest: repurchaseFee,
        })
      } catch (e) {
        console.error(e)
      } finally {
        setConfirmation(undefined)
      }
    },
    [walletClient, setConfirmation, prices, adjust],
  )

  const collect = useCallback(
    async (position: BondPosition) => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        setConfirmation({
          title: 'Collecting',
          body: 'Please confirm in your wallet.',
          fields: [
            {
              direction: 'out',
              currency: position.underlying,
              label: position.underlying.symbol,
              value: formatUnits(
                position.amount,
                position.underlying.decimals,
                prices[position.underlying.address],
              ),
            },
          ],
        })
        await adjust({
          position,
          newAmount: 0n,
          expectedInterest: 0n,
        })
      } catch (e) {
        console.error(e)
      } finally {
        setConfirmation(undefined)
      }
    },
    [walletClient, setConfirmation, prices, adjust],
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
