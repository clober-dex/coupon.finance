import React, { useCallback } from 'react'
import { Hash } from 'viem'
import {
  useAccount,
  useNetwork,
  usePublicClient,
  useQuery,
  useQueryClient,
  useWalletClient,
} from 'wagmi'

import { Asset } from '../model/asset'
import { permit20 } from '../utils/permit20'
import { CONTRACT_ADDRESSES } from '../constants/addresses'
import { formatUnits } from '../utils/numbers'
import { BorrowController__factory, RepayAdapter__factory } from '../typechain'
import { fetchLoanPositions } from '../apis/loan-position'
import { Collateral } from '../model/collateral'
import { LoanPosition } from '../model/loan-position'
import { Currency } from '../model/currency'
import { permit721 } from '../utils/permit721'
import { writeContract } from '../utils/wallet'
import { CHAIN_IDS } from '../constants/chain'

import { useCurrencyContext } from './currency-context'
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
  extendLoanDuration: (
    underlying: Currency,
    positionId: bigint,
    epochs: number,
    expectedInterest: bigint,
  ) => Promise<void>
  shortenLoanDuration: (
    underlying: Currency,
    positionId: bigint,
    epochs: number,
    expectedProceeds: bigint,
  ) => Promise<void>
  borrowMore: (
    position: LoanPosition,
    amount: bigint,
    expectedInterest: bigint,
  ) => Promise<void>
  repay: (
    position: LoanPosition,
    amount: bigint,
    expectedProceeds: bigint,
  ) => Promise<void>
  repayWithCollateral: (
    position: LoanPosition,
    amount: bigint,
    mightBoughtDebtAmount: bigint,
    expectedProceeds: bigint,
    swapData: `0x${string}`,
  ) => Promise<void>
  addCollateral: (position: LoanPosition, amount: bigint) => Promise<void>
  removeCollateral: (position: LoanPosition, amount: bigint) => Promise<void>
}

const Context = React.createContext<BorrowContext>({
  positions: [],
  borrow: () => Promise.resolve(undefined),
  repay: () => Promise.resolve(),
  repayWithCollateral: () => Promise.resolve(),
  borrowMore: () => Promise.resolve(),
  extendLoanDuration: () => Promise.resolve(),
  shortenLoanDuration: () => Promise.resolve(),
  addCollateral: () => Promise.resolve(),
  removeCollateral: () => Promise.resolve(),
})

export const BorrowProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const queryClient = useQueryClient()

  const { address: userAddress } = useAccount()
  const { chain } = useNetwork()

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { setConfirmation } = useTransactionContext()
  const { calculateETHValue } = useCurrencyContext()

  const { data: positions } = useQuery(
    ['loan-positions', userAddress, chain],
    () =>
      userAddress && chain ? fetchLoanPositions(chain.id, userAddress) : [],
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
      if (!walletClient || !chain) {
        // TODO: alert wallet connect
        return
      }

      let hash: Hash | undefined
      try {
        const { deadline, r, s, v } = await permit20(
          chain.id,
          walletClient,
          collateral.underlying,
          walletClient.account.address,
          CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].BorrowController,
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
        hash = await writeContract(publicClient, walletClient, {
          address: CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].BorrowController,
          abi: BorrowController__factory.abi,
          functionName: 'borrow',
          args: [
            collateral.substitute.address,
            loanAsset.substitutes[0].address,
            collateralAmount,
            loanAmount + expectedInterest,
            expectedInterest,
            epochs,
            {
              permitAmount: collateralAmount,
              signature: { deadline, v, r, s },
            },
          ],
          value: calculateETHValue(collateral.underlying, collateralAmount),
          account: walletClient.account,
        })
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
      publicClient,
      queryClient,
      setConfirmation,
      calculateETHValue,
      walletClient,
      chain,
    ],
  )

  const repay = useCallback(
    async (
      position: LoanPosition,
      amount: bigint,
      expectedProceeds: bigint,
    ): Promise<void> => {
      if (!walletClient || !chain) {
        // TODO: alert wallet connect
        return
      }

      try {
        const deadline = BigInt(
          Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24),
        )
        const positionPermitResult = await permit721(
          chain.id,
          walletClient,
          CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].LoanPositionManager,
          position.id,
          walletClient.account.address,
          CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].BorrowController,
          deadline,
        )
        const debtPermitResult = await permit20(
          chain.id,
          walletClient,
          position.underlying,
          walletClient.account.address,
          CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].BorrowController,
          amount,
          deadline,
        )

        setConfirmation({
          title: `Repaying ${position.underlying.symbol}`,
          body: 'Please confirm in your wallet.',
          fields: [
            {
              currency: position.underlying,
              label: position.underlying.symbol,
              value: formatUnits(amount, position.underlying.decimals),
            },
          ],
        })
        await writeContract(publicClient, walletClient, {
          address: CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].BorrowController,
          abi: BorrowController__factory.abi,
          functionName: 'repay',
          args: [
            position.id,
            amount + expectedProceeds,
            expectedProceeds,
            { ...positionPermitResult },
            {
              permitAmount: amount,
              signature: {
                deadline: debtPermitResult.deadline,
                v: debtPermitResult.v,
                r: debtPermitResult.r,
                s: debtPermitResult.s,
              },
            },
          ],
          value: calculateETHValue(position.underlying, amount),
          account: walletClient.account,
        })
        await queryClient.invalidateQueries(['loan-positions'])
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [
      publicClient,
      queryClient,
      setConfirmation,
      calculateETHValue,
      walletClient,
      chain,
    ],
  )

  const repayWithCollateral = useCallback(
    async (
      position: LoanPosition,
      amount: bigint,
      mightBoughtDebtAmount: bigint,
      expectedProceeds: bigint,
      swapData: `0x${string}`,
    ): Promise<void> => {
      if (!walletClient || !chain) {
        // TODO: alert wallet connect
        return
      }

      try {
        const { deadline, r, s, v } = await permit721(
          chain.id,
          walletClient,
          CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].LoanPositionManager,
          position.id,
          walletClient.account.address,
          CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].OdosRepayAdapter,
          BigInt(Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24)),
        )

        setConfirmation({
          title: `Repay with collateral ${position.underlying.symbol}`,
          body: 'Please confirm in your wallet.',
          fields: [
            {
              currency: position.collateral.underlying,
              label: position.collateral.underlying.symbol,
              value: formatUnits(
                amount,
                position.collateral.underlying.decimals,
              ),
            },
            {
              currency: position.underlying,
              label: position.underlying.symbol,
              value: formatUnits(
                mightBoughtDebtAmount,
                position.underlying.decimals,
              ),
            },
          ],
        })

        await writeContract(publicClient, walletClient, {
          address: CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].OdosRepayAdapter,
          abi: RepayAdapter__factory.abi,
          functionName: 'repayWithCollateral',
          args: [
            position.id,
            amount,
            expectedProceeds,
            swapData,
            { deadline, v, r, s },
          ],
          account: walletClient.account,
        })
        await queryClient.invalidateQueries(['loan-positions'])
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [publicClient, queryClient, setConfirmation, walletClient, chain],
  )

  const borrowMore = useCallback(
    async (
      position: LoanPosition,
      amount: bigint,
      expectedInterest: bigint,
    ): Promise<void> => {
      if (!walletClient || !chain) {
        // TODO: alert wallet connect
        return
      }

      try {
        const { deadline, r, s, v } = await permit721(
          chain.id,
          walletClient,
          CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].LoanPositionManager,
          position.id,
          walletClient.account.address,
          CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].BorrowController,
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
        await writeContract(publicClient, walletClient, {
          address: CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].BorrowController,
          abi: BorrowController__factory.abi,
          functionName: 'borrowMore',
          args: [
            position.id,
            amount + expectedInterest,
            expectedInterest,
            { deadline, v, r, s },
          ],
          account: walletClient.account,
        })
        await queryClient.invalidateQueries(['loan-positions'])
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [publicClient, queryClient, setConfirmation, walletClient, chain],
  )

  const extendLoanDuration = useCallback(
    async (
      underlying: Currency,
      positionId: bigint,
      epochs: number,
      expectedInterest: bigint,
    ): Promise<void> => {
      if (!walletClient || !chain) {
        // TODO: alert wallet connect
        return
      }

      try {
        const deadline = BigInt(
          Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24),
        )
        const positionPermitResult = await permit721(
          chain.id,
          walletClient,
          CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].LoanPositionManager,
          positionId,
          walletClient.account.address,
          CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].BorrowController,
          deadline,
        )

        const debtPermitResult = await permit20(
          chain.id,
          walletClient,
          underlying,
          walletClient.account.address,
          CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].BorrowController,
          expectedInterest,
          deadline,
        )

        setConfirmation({
          title: `Extending loan duration with interest`,
          body: 'Please confirm in your wallet.',
          fields: [
            {
              currency: underlying,
              label: underlying.symbol,
              value: formatUnits(expectedInterest, underlying.decimals),
            },
          ],
        })

        await writeContract(publicClient, walletClient, {
          address: CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].BorrowController,
          abi: BorrowController__factory.abi,
          functionName: 'extendLoanDuration',
          args: [
            positionId,
            epochs,
            expectedInterest,
            { ...positionPermitResult },
            {
              permitAmount: expectedInterest,
              signature: {
                deadline: debtPermitResult.deadline,
                r: debtPermitResult.r,
                s: debtPermitResult.s,
                v: debtPermitResult.v,
              },
            },
          ],
          value: calculateETHValue(underlying, expectedInterest),
          account: walletClient.account,
        })
        await queryClient.invalidateQueries(['loan-positions'])
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [
      publicClient,
      queryClient,
      setConfirmation,
      calculateETHValue,
      walletClient,
      chain,
    ],
  )

  const shortenLoanDuration = useCallback(
    async (
      underlying: Currency,
      positionId: bigint,
      epochs: number,
      expectedProceeds: bigint,
    ): Promise<void> => {
      if (!walletClient || !chain) {
        // TODO: alert wallet connect
        return
      }

      try {
        const { deadline, s, r, v } = await permit721(
          chain.id,
          walletClient,
          CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].LoanPositionManager,
          positionId,
          walletClient.account.address,
          CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].BorrowController,
          BigInt(Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24)),
        )

        setConfirmation({
          title: `Shortening loan duration with refund`,
          body: 'Please confirm in your wallet.',
          fields: [
            {
              currency: underlying,
              label: underlying.symbol,
              value: formatUnits(expectedProceeds, underlying.decimals),
            },
          ],
        })
        await writeContract(publicClient, walletClient, {
          address: CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].BorrowController,
          abi: BorrowController__factory.abi,
          functionName: 'shortenLoanDuration',
          args: [positionId, epochs, expectedProceeds, { deadline, v, r, s }],
          account: walletClient.account,
        })
        await queryClient.invalidateQueries(['loan-positions'])
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [publicClient, queryClient, setConfirmation, walletClient, chain],
  )

  const addCollateral = useCallback(
    async (position: LoanPosition, amount: bigint): Promise<void> => {
      if (!walletClient || !chain) {
        // TODO: alert wallet connect
        return
      }

      try {
        const deadline = BigInt(
          Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24),
        )
        const positionPermitResult = await permit721(
          chain.id,
          walletClient,
          CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].LoanPositionManager,
          position.id,
          walletClient.account.address,
          CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].BorrowController,
          deadline,
        )
        const debtPermitResult = await permit20(
          chain.id,
          walletClient,
          position.collateral.underlying,
          walletClient.account.address,
          CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].BorrowController,
          amount,
          deadline,
        )

        setConfirmation({
          title: `Adding collateral`,
          body: 'Please confirm in your wallet.',
          fields: [
            {
              currency: position.collateral.underlying,
              label: position.collateral.underlying.symbol,
              value: formatUnits(
                amount,
                position.collateral.underlying.decimals,
              ),
            },
          ],
        })
        await writeContract(publicClient, walletClient, {
          address: CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].BorrowController,
          abi: BorrowController__factory.abi,
          functionName: 'addCollateral',
          args: [
            position.id,
            amount,
            { ...positionPermitResult },
            {
              permitAmount: amount,
              signature: {
                deadline: debtPermitResult.deadline,
                r: debtPermitResult.r,
                s: debtPermitResult.s,
                v: debtPermitResult.v,
              },
            },
          ],
          value: calculateETHValue(position.collateral.underlying, amount),
          account: walletClient.account,
        })
        await queryClient.invalidateQueries(['loan-positions'])
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [
      publicClient,
      queryClient,
      setConfirmation,
      calculateETHValue,
      walletClient,
      chain,
    ],
  )

  const removeCollateral = useCallback(
    async (position: LoanPosition, amount: bigint): Promise<void> => {
      if (!walletClient || !chain) {
        // TODO: alert wallet connect
        return
      }

      try {
        const { deadline, r, s, v } = await permit721(
          chain.id,
          walletClient,
          CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].LoanPositionManager,
          position.id,
          walletClient.account.address,
          CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].BorrowController,
          BigInt(Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24)),
        )

        setConfirmation({
          title: `Removing collateral`,
          body: 'Please confirm in your wallet.',
          fields: [
            {
              currency: position.collateral.underlying,
              label: position.collateral.underlying.symbol,
              value: formatUnits(
                amount,
                position.collateral.underlying.decimals,
              ),
            },
          ],
        })
        await writeContract(publicClient, walletClient, {
          address: CONTRACT_ADDRESSES[chain.id as CHAIN_IDS].BorrowController,
          abi: BorrowController__factory.abi,
          functionName: 'removeCollateral',
          args: [position.id, amount, { deadline, v, r, s }],
          account: walletClient.account,
        })
        await queryClient.invalidateQueries(['loan-positions'])
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [publicClient, queryClient, setConfirmation, walletClient, chain],
  )

  return (
    <Context.Provider
      value={{
        positions,
        borrow,
        repay,
        repayWithCollateral,
        borrowMore,
        extendLoanDuration,
        shortenLoanDuration,
        addCollateral,
        removeCollateral,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useBorrowContext = () => React.useContext(Context) as BorrowContext
