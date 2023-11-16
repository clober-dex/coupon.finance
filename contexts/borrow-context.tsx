import React, { useCallback } from 'react'
import { Hash } from 'viem'
import {
  useAccount,
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
import { getDeadlineTimestampInSeconds } from '../utils/date'

import { useCurrencyContext } from './currency-context'
import { useTransactionContext } from './transaction-context'
import { useChainContext } from './chain-context'

type BorrowContext = {
  positions: LoanPosition[]
  borrow: (
    collateral: Collateral,
    collateralAmount: bigint,
    loanAsset: Asset,
    loanAmount: bigint,
    epochs: number,
    expectedInterest: bigint,
    pendingPosition?: LoanPosition,
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
    refundAmountAfterSwap: bigint,
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
  const { selectedChain } = useChainContext()

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { setConfirmation } = useTransactionContext()
  const { calculateETHValue, prices } = useCurrencyContext()
  const [pendingPositions, setPendingPositions] = React.useState<
    LoanPosition[]
  >([])

  const { data: positions } = useQuery(
    ['loan-positions', userAddress, selectedChain, pendingPositions],
    async () => {
      if (!userAddress) {
        return []
      }
      const confirmationPositions = await fetchLoanPositions(
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

  const borrow = useCallback(
    async (
      collateral: Collateral,
      collateralAmount: bigint,
      loanAsset: Asset,
      loanAmount: bigint,
      epochs: number,
      expectedInterest: bigint,
      pendingPosition?: LoanPosition,
    ): Promise<Hash | undefined> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      let hash: Hash | undefined
      try {
        const ethValue = calculateETHValue(
          collateral.underlying,
          collateralAmount,
        )
        const permitAmount = collateralAmount - ethValue
        const { deadline, r, s, v } = await permit20(
          selectedChain.id,
          walletClient,
          collateral.underlying,
          walletClient.account.address,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
          permitAmount,
          getDeadlineTimestampInSeconds(),
        )
        setConfirmation({
          title: `Borrowing ${loanAsset.underlying.symbol}`,
          body: 'Please confirm in your wallet.',
          fields: [
            {
              direction: 'in',
              currency: collateral.underlying,
              label: collateral.underlying.symbol,
              value: formatUnits(
                collateralAmount,
                collateral.underlying.decimals,
                prices[collateral.underlying.address],
              ),
            },
            {
              direction: 'out',
              currency: loanAsset.underlying,
              label: loanAsset.underlying.symbol,
              value: formatUnits(
                loanAmount,
                loanAsset.underlying.decimals,
                prices[loanAsset.underlying.address],
              ),
            },
          ],
        })
        hash = await writeContract(publicClient, walletClient, {
          address:
            CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
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
              permitAmount,
              signature: { deadline, v, r, s },
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
            ] as LoanPosition[],
        )
        await queryClient.invalidateQueries(['loan-positions'])
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
        const positionPermitResult = await permit721(
          selectedChain.id,
          walletClient,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].LoanPositionManager,
          position.id,
          walletClient.account.address,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
          getDeadlineTimestampInSeconds(),
        )
        const ethValue = calculateETHValue(position.underlying, amount)
        const permitAmount = amount - ethValue
        const debtPermitResult = await permit20(
          selectedChain.id,
          walletClient,
          position.underlying,
          walletClient.account.address,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
          permitAmount,
          getDeadlineTimestampInSeconds(),
        )

        setConfirmation({
          title: `Repaying ${position.underlying.symbol}`,
          body: 'Please confirm in your wallet.',
          fields: [
            {
              direction: 'in',
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
        await writeContract(publicClient, walletClient, {
          address:
            CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
          abi: BorrowController__factory.abi,
          functionName: 'repay',
          args: [
            position.id,
            amount + expectedProceeds,
            expectedProceeds,
            { ...positionPermitResult },
            {
              permitAmount,
              signature: {
                deadline: debtPermitResult.deadline,
                v: debtPermitResult.v,
                r: debtPermitResult.r,
                s: debtPermitResult.s,
              },
            },
          ],
          value: ethValue,
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
      walletClient,
      selectedChain.id,
      calculateETHValue,
      setConfirmation,
      prices,
      publicClient,
      queryClient,
    ],
  )

  const repayWithCollateral = useCallback(
    async (
      position: LoanPosition,
      amount: bigint,
      mightBoughtDebtAmount: bigint,
      expectedProceeds: bigint,
      swapData: `0x${string}`,
      refundAmountAfterSwap: bigint,
    ): Promise<void> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        const { deadline, r, s, v } = await permit721(
          selectedChain.id,
          walletClient,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].LoanPositionManager,
          position.id,
          walletClient.account.address,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].OdosRepayAdapter,
          getDeadlineTimestampInSeconds(),
        )

        const fields = [
          {
            currency: position.collateral.underlying,
            label: `Use ${position.collateral.underlying.symbol}`,
            value: formatUnits(
              amount,
              position.collateral.underlying.decimals,
              prices[position.collateral.underlying.address],
            ),
          },
          {
            currency: position.underlying,
            label: `Repay ${position.underlying.symbol}`,
            value: formatUnits(
              mightBoughtDebtAmount,
              position.underlying.decimals,
              prices[position.underlying.address],
            ),
          },
        ]
        setConfirmation({
          title: `Repay with collateral ${position.underlying.symbol}`,
          body: 'Please confirm in your wallet.',
          fields:
            refundAmountAfterSwap > 0
              ? [
                  ...fields,
                  {
                    direction: 'out',
                    currency: position.underlying,
                    label: position.underlying.symbol,
                    value: formatUnits(
                      refundAmountAfterSwap,
                      position.underlying.decimals,
                      prices[position.underlying.address],
                    ),
                  },
                ]
              : fields,
        })

        await writeContract(publicClient, walletClient, {
          address:
            CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].OdosRepayAdapter,
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
    [
      walletClient,
      selectedChain.id,
      prices,
      setConfirmation,
      publicClient,
      queryClient,
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

      try {
        const { deadline, r, s, v } = await permit721(
          selectedChain.id,
          walletClient,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].LoanPositionManager,
          position.id,
          walletClient.account.address,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
          getDeadlineTimestampInSeconds(),
        )
        setConfirmation({
          title: `Borrowing more ${position.underlying.symbol}`,
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
        await writeContract(publicClient, walletClient, {
          address:
            CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
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
    [
      walletClient,
      selectedChain.id,
      setConfirmation,
      prices,
      publicClient,
      queryClient,
    ],
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
        const positionPermitResult = await permit721(
          selectedChain.id,
          walletClient,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].LoanPositionManager,
          positionId,
          walletClient.account.address,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
          getDeadlineTimestampInSeconds(),
        )

        const ethValue = calculateETHValue(underlying, expectedInterest)
        const permitAmount = expectedInterest - ethValue
        const debtPermitResult = await permit20(
          selectedChain.id,
          walletClient,
          underlying,
          walletClient.account.address,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
          permitAmount,
          getDeadlineTimestampInSeconds(),
        )

        setConfirmation({
          title: `Extending loan duration with interest`,
          body: 'Please confirm in your wallet.',
          fields: [
            {
              direction: 'in',
              currency: underlying,
              label: underlying.symbol,
              value: formatUnits(
                expectedInterest,
                underlying.decimals,
                prices[underlying.address],
              ),
            },
          ],
        })

        await writeContract(publicClient, walletClient, {
          address:
            CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
          abi: BorrowController__factory.abi,
          functionName: 'extendLoanDuration',
          args: [
            positionId,
            epochs,
            expectedInterest,
            { ...positionPermitResult },
            {
              permitAmount,
              signature: {
                deadline: debtPermitResult.deadline,
                r: debtPermitResult.r,
                s: debtPermitResult.s,
                v: debtPermitResult.v,
              },
            },
          ],
          value: ethValue,
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
      walletClient,
      selectedChain.id,
      calculateETHValue,
      setConfirmation,
      prices,
      publicClient,
      queryClient,
    ],
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
          selectedChain.id,
          walletClient,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].LoanPositionManager,
          positionId,
          walletClient.account.address,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
          getDeadlineTimestampInSeconds(),
        )

        setConfirmation({
          title: `Shortening loan duration with refund`,
          body: 'Please confirm in your wallet.',
          fields: [
            {
              direction: 'out',
              currency: underlying,
              label: underlying.symbol,
              value: formatUnits(
                expectedProceeds,
                underlying.decimals,
                prices[underlying.address],
              ),
            },
          ],
        })
        await writeContract(publicClient, walletClient, {
          address:
            CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
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
    [
      walletClient,
      selectedChain.id,
      setConfirmation,
      prices,
      publicClient,
      queryClient,
    ],
  )

  const addCollateral = useCallback(
    async (position: LoanPosition, amount: bigint): Promise<void> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        const positionPermitResult = await permit721(
          selectedChain.id,
          walletClient,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].LoanPositionManager,
          position.id,
          walletClient.account.address,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
          getDeadlineTimestampInSeconds(),
        )

        const ethValue = calculateETHValue(
          position.collateral.underlying,
          amount,
        )
        const permitAmount = amount - ethValue
        const debtPermitResult = await permit20(
          selectedChain.id,
          walletClient,
          position.collateral.underlying,
          walletClient.account.address,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
          permitAmount,
          getDeadlineTimestampInSeconds(),
        )

        setConfirmation({
          title: `Adding collateral`,
          body: 'Please confirm in your wallet.',
          fields: [
            {
              direction: 'in',
              currency: position.collateral.underlying,
              label: position.collateral.underlying.symbol,
              value: formatUnits(
                amount,
                position.collateral.underlying.decimals,
                prices[position.collateral.underlying.address],
              ),
            },
          ],
        })
        await writeContract(publicClient, walletClient, {
          address:
            CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
          abi: BorrowController__factory.abi,
          functionName: 'addCollateral',
          args: [
            position.id,
            amount,
            { ...positionPermitResult },
            {
              permitAmount,
              signature: {
                deadline: debtPermitResult.deadline,
                r: debtPermitResult.r,
                s: debtPermitResult.s,
                v: debtPermitResult.v,
              },
            },
          ],
          value: ethValue,
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
      walletClient,
      selectedChain.id,
      calculateETHValue,
      setConfirmation,
      prices,
      publicClient,
      queryClient,
    ],
  )

  const removeCollateral = useCallback(
    async (position: LoanPosition, amount: bigint): Promise<void> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        const { deadline, r, s, v } = await permit721(
          selectedChain.id,
          walletClient,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].LoanPositionManager,
          position.id,
          walletClient.account.address,
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
          getDeadlineTimestampInSeconds(),
        )

        setConfirmation({
          title: `Removing collateral`,
          body: 'Please confirm in your wallet.',
          fields: [
            {
              direction: 'out',
              currency: position.collateral.underlying,
              label: position.collateral.underlying.symbol,
              value: formatUnits(
                amount,
                position.collateral.underlying.decimals,
                prices[position.collateral.underlying.address],
              ),
            },
          ],
        })
        await writeContract(publicClient, walletClient, {
          address:
            CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
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
    [
      walletClient,
      selectedChain.id,
      setConfirmation,
      prices,
      publicClient,
      queryClient,
    ],
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
