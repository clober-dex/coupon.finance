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
import { BorrowController__factory, RepayAdapter__factory } from '../typechain'
import { fetchLoanPositions } from '../apis/loan-position'
import { Collateral } from '../model/collateral'
import { LoanPosition } from '../model/loan-position'
import { Currency } from '../model/currency'
import { permit721 } from '../utils/permit721'
import { writeContract } from '../utils/wallet'

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

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { setConfirmation } = useTransactionContext()
  const { value } = useCurrencyContext()

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
        hash = await writeContract(publicClient, walletClient, {
          address: CONTRACT_ADDRESSES.BorrowController,
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
          value: value(collateral.underlying, collateralAmount),
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
    [publicClient, queryClient, setConfirmation, value, walletClient],
  )

  const repay = useCallback(
    async (
      position: LoanPosition,
      amount: bigint,
      expectedProceeds: bigint,
    ): Promise<void> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        const deadline = BigInt(
          Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24),
        )
        const positionPermitResult = await permit721(
          walletClient,
          CONTRACT_ADDRESSES.LoanPositionManager,
          position.id,
          walletClient.account.address,
          CONTRACT_ADDRESSES.BorrowController,
          deadline,
        )
        const debtPermitResult = await permit20(
          walletClient,
          position.underlying,
          walletClient.account.address,
          CONTRACT_ADDRESSES.BorrowController,
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
          address: CONTRACT_ADDRESSES.BorrowController,
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
          value: value(position.underlying, amount),
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
    [publicClient, queryClient, setConfirmation, value, walletClient],
  )

  const repayWithCollateral = useCallback(
    async (
      position: LoanPosition,
      amount: bigint,
      mightBoughtDebtAmount: bigint,
      expectedProceeds: bigint,
      swapData: `0x${string}`,
    ): Promise<void> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        const { deadline, r, s, v } = await permit721(
          walletClient,
          CONTRACT_ADDRESSES.LoanPositionManager,
          position.id,
          walletClient.account.address,
          CONTRACT_ADDRESSES.OdosRepayAdapter,
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
          address: CONTRACT_ADDRESSES.OdosRepayAdapter,
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
    [publicClient, queryClient, setConfirmation, walletClient],
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
        await writeContract(publicClient, walletClient, {
          address: CONTRACT_ADDRESSES.BorrowController,
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
    [publicClient, queryClient, setConfirmation, walletClient],
  )

  const extendLoanDuration = useCallback(
    async (
      underlying: Currency,
      positionId: bigint,
      epochs: number,
      expectedInterest: bigint,
    ): Promise<void> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        const deadline = BigInt(
          Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24),
        )
        const positionPermitResult = await permit721(
          walletClient,
          CONTRACT_ADDRESSES.LoanPositionManager,
          positionId,
          walletClient.account.address,
          CONTRACT_ADDRESSES.BorrowController,
          deadline,
        )

        const debtPermitResult = await permit20(
          walletClient,
          underlying,
          walletClient.account.address,
          CONTRACT_ADDRESSES.BorrowController,
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
          address: CONTRACT_ADDRESSES.BorrowController,
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
          value: value(underlying, expectedInterest),
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
    [publicClient, queryClient, setConfirmation, value, walletClient],
  )

  const shortenLoanDuration = useCallback(
    async (
      underlying: Currency,
      positionId: bigint,
      epochs: number,
      expectedProceeds: bigint,
    ): Promise<void> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        const { deadline, s, r, v } = await permit721(
          walletClient,
          CONTRACT_ADDRESSES.LoanPositionManager,
          positionId,
          walletClient.account.address,
          CONTRACT_ADDRESSES.BorrowController,
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
          address: CONTRACT_ADDRESSES.BorrowController,
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
    [publicClient, queryClient, setConfirmation, walletClient],
  )

  const addCollateral = useCallback(
    async (position: LoanPosition, amount: bigint): Promise<void> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        const deadline = BigInt(
          Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24),
        )
        const positionPermitResult = await permit721(
          walletClient,
          CONTRACT_ADDRESSES.LoanPositionManager,
          position.id,
          walletClient.account.address,
          CONTRACT_ADDRESSES.BorrowController,
          deadline,
        )
        const debtPermitResult = await permit20(
          walletClient,
          position.collateral.underlying,
          walletClient.account.address,
          CONTRACT_ADDRESSES.BorrowController,
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
          address: CONTRACT_ADDRESSES.BorrowController,
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
          value: value(position.collateral.underlying, amount),
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
    [publicClient, queryClient, setConfirmation, value, walletClient],
  )

  const removeCollateral = useCallback(
    async (position: LoanPosition, amount: bigint): Promise<void> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

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
          address: CONTRACT_ADDRESSES.BorrowController,
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
    [publicClient, queryClient, setConfirmation, walletClient],
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
