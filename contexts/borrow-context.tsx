import React, { useCallback } from 'react'
import { Hash } from 'viem'
import {
  useAccount,
  useBalance,
  usePublicClient,
  useQuery,
  useQueryClient,
  useWalletClient,
} from 'wagmi'

import { Asset } from '../model/asset'
import { permit20 } from '../utils/permit20'
import { CONTRACT_ADDRESSES } from '../utils/addresses'
import { formatUnits } from '../utils/numbers'
import { BorrowController__factory } from '../typechain'
import { max } from '../utils/bigint'
import { fetchLoanPositions } from '../api/loan-position'
import { Collateral } from '../model/collateral'
import { LoanPosition } from '../model/loan-position'
import { permit721 } from '../utils/permit721'

import { isEthereum, useCurrencyContext } from './currency-context'
import { useTransactionContext } from './transaction-context'

type BorrowContext = {
  positions: LoanPosition[]
  borrow: (
    collateral: Collateral,
    collateralAmount: bigint,
    loanAsset: Asset,
    loanAmount: bigint,
    epochs: number,
    expectedInterest: bigint,
  ) => Promise<Hash | undefined>
  borrowMore: (
    position: LoanPosition,
    amount: bigint,
    expectedInterest: bigint,
  ) => Promise<void>
}

const Context = React.createContext<BorrowContext>({
  positions: [],
  borrow: () => Promise.resolve(undefined),
  borrowMore: () => Promise.resolve(),
})

const SLIPPAGE_PERCENTAGE = 0

export const BorrowProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const queryClient = useQueryClient()

  const { address: userAddress } = useAccount()
  const { data: balance } = useBalance({ address: userAddress })

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { setConfirmation } = useTransactionContext()
  const { balances } = useCurrencyContext()

  const { data: positions } = useQuery(
    ['loan-positions', userAddress],
    () => (userAddress ? fetchLoanPositions(userAddress) : []),
    {
      refetchOnWindowFocus: true,
      refetchInterval: 2 * 1000,
      initialData: [],
    },
  )

  const borrow = useCallback(
    async (
      collateral: Collateral,
      collateralAmount: bigint,
      loanAsset: Asset,
      loanAmount: bigint,
      epochs: number,
      expectedInterest: bigint,
    ): Promise<Hash | undefined> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      const maximumInterestPaid = max(
        BigInt(
          Math.floor(Number(expectedInterest) * (1 + SLIPPAGE_PERCENTAGE)),
        ),
        expectedInterest,
      )
      const wethBalance = isEthereum(collateral.underlying)
        ? balances[collateral.underlying.address] - (balance?.value || 0n)
        : 0n

      let hash: Hash | undefined
      try {
        const { deadline, r, s, v } = await permit20(
          walletClient,
          collateral.underlying,
          walletClient.account.address,
          CONTRACT_ADDRESSES.BorrowController,
          collateralAmount,
          BigInt(Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24)),
        )
        setConfirmation({
          title: `Borrowing ${loanAsset.underlying.symbol}`,
          body: 'Please confirm in your wallet.',
          fields: [
            {
              currency: collateral.underlying,
              label: collateral.underlying.symbol,
              value: formatUnits(
                collateralAmount,
                collateral.underlying.decimals,
              ),
            },
            {
              currency: loanAsset.underlying,
              label: loanAsset.underlying.symbol,
              value: formatUnits(loanAmount, loanAsset.underlying.decimals),
            },
          ],
        })
        const { request } = await publicClient.simulateContract({
          address: CONTRACT_ADDRESSES.BorrowController,
          abi: BorrowController__factory.abi,
          functionName: 'borrow',
          args: [
            collateral.substitute.address,
            loanAsset.substitutes[0].address,
            collateralAmount,
            loanAmount + maximumInterestPaid,
            maximumInterestPaid,
            epochs,
            { deadline, v, r, s },
          ],
          value: isEthereum(collateral.underlying)
            ? max(collateralAmount - wethBalance, 0n)
            : 0n,
          account: walletClient.account,
        })
        hash = await walletClient.writeContract(request)
        await queryClient.invalidateQueries(['loan-positions'])
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

  const borrowMore = useCallback(
    async (
      position: LoanPosition,
      amount: bigint,
      expectedInterest: bigint,
    ): Promise<void> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      const maximumInterestPaid = max(
        BigInt(
          Math.floor(Number(expectedInterest) * (1 + SLIPPAGE_PERCENTAGE)),
        ),
        expectedInterest,
      )

      try {
        const { deadline, r, s, v } = await permit721(
          walletClient,
          CONTRACT_ADDRESSES.LoanPositionManager,
          position.id,
          walletClient.account.address,
          CONTRACT_ADDRESSES.BorrowController,
          BigInt(Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24)),
        )
        setConfirmation({
          title: `Borrowing more ${position.underlying.symbol}`,
          body: 'Please confirm in your wallet.',
          fields: [
            {
              currency: position.underlying,
              label: position.underlying.symbol,
              value: formatUnits(amount, position.underlying.decimals),
            },
          ],
        })
        const { request } = await publicClient.simulateContract({
          address: CONTRACT_ADDRESSES.BorrowController,
          abi: BorrowController__factory.abi,
          functionName: 'borrowMore',
          args: [
            position.id,
            amount + maximumInterestPaid,
            maximumInterestPaid,
            { deadline, v, r, s },
          ],
          account: walletClient.account,
        })
        await walletClient.writeContract(request)
        await queryClient.invalidateQueries(['loan-positions'])
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [publicClient, queryClient, setConfirmation, walletClient],
  )

  return (
    <Context.Provider
      value={{
        positions,
        borrow,
        borrowMore,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useBorrowContext = () => React.useContext(Context) as BorrowContext
