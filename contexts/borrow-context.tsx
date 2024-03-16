import React, { useCallback, useMemo } from 'react'
import { Hash, zeroAddress } from 'viem'
import {
  useAccount,
  useFeeData,
  usePublicClient,
  useQuery,
  useQueryClient,
  useWalletClient,
} from 'wagmi'

import { Asset } from '../model/asset'
import { permit20 } from '../utils/permit20'
import { CONTRACT_ADDRESSES } from '../constants/addresses'
import { formatUnits } from '../utils/numbers'
import { extractLoanPositions } from '../apis/loan-position'
import { Collateral } from '../model/collateral'
import { LoanPosition } from '../model/loan-position'
import { Currency } from '../model/currency'
import { permit721 } from '../utils/permit721'
import { writeContract } from '../utils/wallet'
import { CHAIN_IDS } from '../constants/chain'
import { getDeadlineTimestampInSeconds } from '../utils/date'
import { toWrapETH } from '../utils/currency'
import { BORROW_CONTROLLER_ABI } from '../abis/periphery/borrow-controller-abi'
import { zeroBytes32 } from '../utils/bytes'
import { abs, applyPercent, max } from '../utils/bigint'
import { fetchAmountOutByOdos, fetchCallDataByOdos } from '../apis/odos'
import { fetchMarketsByQuoteTokenAddress } from '../apis/market'
import {
  calculateCouponsToBorrow,
  calculateCouponsToRepay,
} from '../model/market'
import { calculateLtv, calculateMaxLoanableAmount } from '../utils/ltv'
import { extractLiquidationHistories } from '../apis/liquidation-histories'
import { LiquidationHistory } from '../model/liquidation-history'
import { fetchAmountOutByCouponOracle } from '../utils/oracle'

import { useCurrencyContext } from './currency-context'
import { useTransactionContext } from './transaction-context'
import { useChainContext } from './chain-context'
import { useSubgraphContext } from './subgraph-context'

export type BorrowContext = {
  positions: LoanPosition[]
  liquidationHistories: LiquidationHistory[]
  pnls: {
    [key in number]: {
      value: number
      profit: number
    }
  }
  multipleFactors: { [key in number]: number }
  borrow: (
    collateral: Collateral,
    collateralAmount: bigint,
    loanAsset: Asset,
    loanAmount: bigint,
    epochs: number,
    expectedInterest: bigint,
    pendingPosition?: LoanPosition,
  ) => Promise<Hash | undefined>
  leverage: (
    collateral: Collateral,
    collateralAmount: bigint,
    collateralWithoutBorrow: bigint,
    loanAsset: Asset,
    loanAmount: bigint,
    epochs: number,
    expectedInterest: bigint,
    swapData: `0x${string}`,
    slippage: number,
    pendingPosition?: LoanPosition,
  ) => Promise<Hash | undefined>
  extendLoanDuration: (
    position: LoanPosition,
    extendedEpoch: number,
    expectedInterest: bigint,
  ) => Promise<void>
  shortenLoanDuration: (
    position: LoanPosition,
    shortenedEpoch: number,
    expectedProceeds: bigint,
  ) => Promise<void>
  borrowMore: (
    position: LoanPosition,
    amount: bigint,
    expectedInterest: bigint,
  ) => Promise<void>
  leverageMore: (
    position: LoanPosition,
    collateralAmountDelta: bigint, // borrowedCollateralAmount
    loanAmount: bigint,
    expectedInterest: bigint,
    swapData: `0x${string}`,
    slippage: number,
  ) => Promise<void>
  repay: (
    position: LoanPosition,
    amount: bigint,
    expectedProceeds: bigint,
  ) => Promise<void>
  repayWithCollateral: (
    position: LoanPosition,
    amount: bigint,
    repayAmount: bigint,
    expectedProceeds: bigint,
    swapData: `0x${string}`,
    slippage: number,
  ) => Promise<void>
  addCollateral: (position: LoanPosition, amount: bigint) => Promise<void>
  removeCollateral: (position: LoanPosition, amount: bigint) => Promise<void>
  closeLeveragePosition: (position: LoanPosition) => Promise<void>
}

const Context = React.createContext<BorrowContext>({
  positions: [],
  liquidationHistories: [],
  pnls: {},
  multipleFactors: {},
  borrow: () => Promise.resolve(undefined),
  leverage: () => Promise.resolve(undefined),
  repay: () => Promise.resolve(),
  repayWithCollateral: () => Promise.resolve(),
  borrowMore: () => Promise.resolve(),
  leverageMore: () => Promise.resolve(),
  extendLoanDuration: () => Promise.resolve(),
  shortenLoanDuration: () => Promise.resolve(),
  addCollateral: () => Promise.resolve(),
  removeCollateral: () => Promise.resolve(),
  closeLeveragePosition: () => Promise.resolve(),
})

export const BorrowProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const queryClient = useQueryClient()

  const { integratedPositions } = useSubgraphContext()
  const { selectedChain } = useChainContext()

  const { address: userAddress } = useAccount()
  const { data: feeData } = useFeeData()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { setConfirmation } = useTransactionContext()
  const { calculateETHValue, prices } = useCurrencyContext()
  const [pendingPositions, setPendingPositions] = React.useState<
    LoanPosition[]
  >([])

  const positions = useMemo(() => {
    if (!integratedPositions) {
      return []
    }
    const confirmationPositions = extractLoanPositions(integratedPositions)
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

  const liquidationHistories = useMemo(() => {
    if (!integratedPositions) {
      return []
    }
    return extractLiquidationHistories(integratedPositions)
  }, [integratedPositions])

  const { data: pnls } = useQuery(
    ['pnls', selectedChain.id, userAddress],
    async () => {
      if (!feeData || !feeData.gasPrice) {
        return {}
      }
      const pnls = await Promise.all(
        positions.map(async (position) => {
          if (!position.isLeverage) {
            return { value: 0, profit: 0 }
          }
          const markets = (
            await fetchMarketsByQuoteTokenAddress(
              selectedChain.id,
              position.substitute.address,
            )
          ).filter((market) => market.epoch <= position.toEpoch.id)
          const { maxRefund } = calculateCouponsToRepay(
            position.substitute,
            markets,
            position.amount,
            0n,
          )
          const amountOut = await fetchAmountOutByCouponOracle({
            amountIn: position.amount - maxRefund,
            inputCurrency: position.underlying,
            outputCurrency: position.collateral.underlying,
            prices,
          })
          const afterDollarValue = Number(
            formatUnits(
              (position.collateralAmount - amountOut) *
                prices[position.collateral.underlying.address].value,
              position.collateral.underlying.decimals +
                prices[position.collateral.underlying.address].decimals,
            ),
          )
          const beforeDollarValue = Number(
            formatUnits(
              (position.collateralAmount - position.borrowedCollateralAmount) *
                position.averageCollateralWithoutBorrowedCurrencyPrice.value,
              position.collateral.underlying.decimals +
                prices[position.collateral.underlying.address].decimals,
            ),
          )
          return {
            value: afterDollarValue / beforeDollarValue,
            profit: afterDollarValue - beforeDollarValue,
          }
        }),
      )
      return pnls.reduce(
        (acc, pnl, index) => {
          acc[Number(positions[index].id)] = pnl
          return acc
        },
        {} as {
          [key in number]: {
            value: number
            profit: number
          }
        },
      )
    },
    {
      refetchInterval: 5 * 1000,
      refetchIntervalInBackground: true,
    },
  )

  const { data: multipleFactors } = useQuery(
    ['multipleFactors', selectedChain.id, userAddress],
    async () => {
      const multipleFactors = await Promise.all(
        positions.map(async (position) => {
          if (!position.isLeverage) {
            return 0
          }
          const liquidationTargetLtv =
            Number(position.collateral.liquidationTargetLtv) /
            Number(position.collateral.ltvPrecision)
          const maxMultiple = Math.floor(1 / (1 - liquidationTargetLtv)) - 0.02
          const inputCollateralAmount =
            position.collateralAmount - position.borrowedCollateralAmount
          const collateralAmountDelta =
            applyPercent(inputCollateralAmount, maxMultiple * 100) -
            position.collateralAmount

          const collateralAmount =
            position.collateralAmount + collateralAmountDelta
          const maxLoanableAmountExcludingCouponFee =
            prices[position.underlying.address] &&
            prices[position.collateral.underlying.address]
              ? max(
                  calculateMaxLoanableAmount(
                    position.underlying,
                    prices[position.underlying.address],
                    position.collateral,
                    prices[position.collateral.underlying.address],
                    collateralAmount,
                  ) - position.amount,
                  0n,
                )
              : 0n
          const [amountOut, markets] = await Promise.all([
            fetchAmountOutByCouponOracle({
              amountIn: abs(collateralAmountDelta),
              inputCurrency: position.collateral.underlying,
              outputCurrency: position.underlying,
              prices,
            }),
            fetchMarketsByQuoteTokenAddress(
              selectedChain.id,
              position.substitute.address,
            ),
          ])
          const { interest } = calculateCouponsToBorrow(
            position.substitute,
            markets.filter((market) => market.epoch <= position.toEpoch.id),
            maxLoanableAmountExcludingCouponFee,
            amountOut,
          )
          const debtAmount = position.amount + amountOut + interest
          const maxLTV = calculateLtv(
            position.underlying,
            prices[position.underlying.address],
            debtAmount,
            position.collateral,
            prices[position.collateral.underlying.address],
            collateralAmount,
          )
          return Math.min(1, maxLTV / (liquidationTargetLtv * 100))
        }),
      )
      return multipleFactors.reduce((acc, multipleFactor, index) => {
        acc[Number(positions[index].id)] = multipleFactor
        return acc
      }, {} as { [key in number]: number })
    },
    {
      refetchInterval: 5 * 1000,
      refetchIntervalInBackground: true,
    },
  )

  const calculatePermitAmount = useCallback(
    (
      underlying: Currency,
      amount: bigint,
    ): {
      permitAmount: bigint
      ethValue: bigint
    } => {
      const ethValue = calculateETHValue(underlying, amount)
      const permitAmount = amount - ethValue
      return { permitAmount, ethValue }
    },
    [calculateETHValue],
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
              currency: toWrapETH(collateral.underlying),
              label: toWrapETH(collateral.underlying).symbol,
              value: formatUnits(
                permitAmount,
                collateral.underlying.decimals,
                prices[collateral.underlying.address],
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
          abi: BORROW_CONTROLLER_ABI,
          functionName: 'borrow',
          args: [
            collateral.substitute.address,
            loanAsset.substitutes[0].address,
            collateralAmount,
            loanAmount + expectedInterest,
            expectedInterest,
            epochs,
            {
              inSubstitute: zeroAddress as `0x${string}`,
              amount: 0n,
              data: zeroBytes32 as `0x${string}`,
            },
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
      calculateETHValue,
      selectedChain.id,
      selectedChain.nativeCurrency,
      setConfirmation,
      prices,
      publicClient,
      queryClient,
    ],
  )

  const leverage = useCallback(
    async (
      collateral: Collateral,
      collateralAmount: bigint,
      collateralWithoutBorrow: bigint,
      loanAsset: Asset,
      loanAmount: bigint,
      epochs: number,
      expectedInterest: bigint,
      swapData: `0x${string}`,
      slippage: number,
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
          collateralWithoutBorrow,
        )
        const permitAmount = collateralWithoutBorrow - ethValue
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
              currency: toWrapETH(collateral.underlying),
              label: toWrapETH(collateral.underlying).symbol,
              value: formatUnits(
                permitAmount,
                collateral.underlying.decimals,
                prices[collateral.underlying.address],
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
                prices[collateral.underlying.address],
              ),
            },
          ],
        })
        const borrowedCollateralAmount =
          collateralAmount - collateralWithoutBorrow
        hash = await writeContract(publicClient, walletClient, {
          address:
            CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
          abi: BORROW_CONTROLLER_ABI,
          functionName: 'borrow',
          args: [
            collateral.substitute.address,
            loanAsset.substitutes[0].address,
            collateralWithoutBorrow +
              applyPercent(borrowedCollateralAmount, 100 - slippage),
            loanAmount + expectedInterest,
            expectedInterest,
            epochs,
            {
              inSubstitute: loanAsset.substitutes[0].address,
              amount: loanAmount,
              data: swapData,
            },
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
      newCollateralAmount,
      newDebtAmount,
      expectedInterest,
      expectedProceeds,
      paidDebtAmount,
      newToEpoch,
      swapParams,
    }: {
      position: LoanPosition
      newCollateralAmount?: bigint
      newDebtAmount?: bigint
      expectedInterest?: bigint
      expectedProceeds?: bigint
      paidDebtAmount?: bigint
      newToEpoch?: number
      swapParams?: {
        inSubstitute: `0x${string}`
        amount: bigint
        data: `0x${string}`
      }
    }) => {
      if (!walletClient) {
        return
      }
      const deadline = getDeadlineTimestampInSeconds()
      const positionPermitResult = await permit721(
        selectedChain.id,
        walletClient,
        CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].LoanPositionManager,
        position.id,
        walletClient.account.address,
        CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
        deadline,
      )

      const addedCollateralAmount = max(
        (newCollateralAmount ?? 0n) - position.collateralAmount,
        0n,
      )
      const {
        ethValue: addedCollateralEthValue,
        permitAmount: collateralPermitAmount,
      } = calculatePermitAmount(
        position.collateral.underlying,
        addedCollateralAmount,
      )
      const collateralPermitResult = await permit20(
        selectedChain.id,
        walletClient,
        position.collateral.underlying,
        walletClient.account.address,
        CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
        collateralPermitAmount,
        deadline,
      )

      const { ethValue: addedDebtEthValue, permitAmount: debtPermitAmount } =
        calculatePermitAmount(position.underlying, paidDebtAmount ?? 0n)
      const debtPermitResult = await permit20(
        selectedChain.id,
        walletClient,
        position.underlying,
        walletClient.account.address,
        CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
        debtPermitAmount,
        deadline,
      )

      await writeContract(
        publicClient,
        walletClient,
        {
          address:
            CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
          abi: BORROW_CONTROLLER_ABI,
          functionName: 'adjust',
          args: [
            position.id,
            newCollateralAmount ?? position.collateralAmount,
            newDebtAmount ?? position.amount,
            (expectedInterest ?? 0n) - (expectedProceeds ?? 0n),
            newToEpoch ?? position.toEpoch.id,
            swapParams ?? {
              inSubstitute: zeroAddress as `0x${string}`,
              amount: 0n,
              data: zeroBytes32 as `0x${string}`,
            },
            { ...positionPermitResult },
            {
              permitAmount: collateralPermitAmount,
              signature: {
                deadline: collateralPermitResult.deadline,
                v: collateralPermitResult.v,
                r: collateralPermitResult.r,
                s: collateralPermitResult.s,
              },
            },
            {
              permitAmount: debtPermitAmount,
              signature: {
                deadline: debtPermitResult.deadline,
                v: debtPermitResult.v,
                r: debtPermitResult.r,
                s: debtPermitResult.s,
              },
            },
          ],
          value: addedCollateralEthValue + addedDebtEthValue,
          account: walletClient.account,
        },
        true,
      )
    },
    [calculatePermitAmount, publicClient, selectedChain.id, walletClient],
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
        const { ethValue, permitAmount } = calculatePermitAmount(
          position.underlying,
          amount,
        )

        const newDebtAmount = max(
          position.amount - (amount + expectedProceeds),
          0n,
        )

        const fields: {
          direction?: 'in' | 'out'
          currency?: Currency
          label: string
          value: string
        }[] = [
          {
            direction: 'in',
            currency: toWrapETH(position.underlying),
            label: toWrapETH(position.underlying).symbol,
            value: formatUnits(
              permitAmount,
              position.underlying.decimals,
              prices[position.underlying.address],
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
              prices[position.underlying.address],
            ),
          },
        ]

        if (newDebtAmount === 0n) {
          fields.push({
            direction: 'out',
            currency: position.collateral.underlying,
            label: position.collateral.underlying.symbol,
            value: formatUnits(
              position.collateralAmount,
              position.collateral.underlying.decimals,
              prices[position.collateral.underlying.address],
            ),
          })
        }

        setConfirmation({
          title: `Repaying ${position.underlying.symbol}`,
          body: 'Please confirm in your wallet.',
          fields,
        })
        await adjust({
          position,
          newDebtAmount,
          newCollateralAmount:
            newDebtAmount === 0n ? 0n : position.collateralAmount,
          expectedProceeds,
          paidDebtAmount: amount,
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
      calculatePermitAmount,
      setConfirmation,
      prices,
      selectedChain.nativeCurrency,
      adjust,
      queryClient,
    ],
  )

  const repayWithCollateral = useCallback(
    async (
      position: LoanPosition,
      amount: bigint,
      repayAmount: bigint,
      expectedProceeds: bigint,
      swapData: `0x${string}`,
      slippage: number = 1,
    ): Promise<void> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        const fields: {
          direction?: 'in' | 'out'
          currency?: Currency
          label: string
          value: string
        }[] = [
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
              repayAmount,
              position.underlying.decimals,
              prices[position.underlying.address],
            ),
          },
        ]

        const dust = max(repayAmount + expectedProceeds - position.amount, 0n)
        const newDebtAmount = max(
          position.amount -
            applyPercent(repayAmount + expectedProceeds, 100 - slippage),
          0n,
        )
        const newCollateralAmount = max(position.collateralAmount - amount, 0n)
        if (dust > 0) {
          fields.push({
            direction: 'out',
            currency: position.underlying,
            label: position.underlying.symbol,
            value: formatUnits(
              dust,
              position.underlying.decimals,
              prices[position.underlying.address],
            ),
          })
        }
        if (newDebtAmount === 0n && newCollateralAmount > 0n) {
          fields.push({
            direction: 'out',
            currency: position.collateral.underlying,
            label: position.collateral.underlying.symbol,
            value: formatUnits(
              newCollateralAmount,
              position.collateral.underlying.decimals,
              prices[position.collateral.underlying.address],
            ),
          })
        }
        setConfirmation({
          title: `Repay with collateral ${position.underlying.symbol}`,
          body: 'Please confirm in your wallet.',
          fields,
        })
        await adjust({
          position,
          newCollateralAmount: newDebtAmount === 0n ? 0n : newCollateralAmount,
          newDebtAmount,
          swapParams: {
            inSubstitute: position.collateral.substitute.address,
            amount: amount,
            data: swapData,
          },
        })
        await queryClient.invalidateQueries(['loan-positions'])
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [walletClient, prices, setConfirmation, adjust, queryClient],
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
        await adjust({
          position,
          newDebtAmount: position.amount + amount + expectedInterest,
          expectedInterest,
        })
        await queryClient.invalidateQueries(['loan-positions'])
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [walletClient, setConfirmation, prices, adjust, queryClient],
  )

  const leverageMore = useCallback(
    async (
      position: LoanPosition,
      collateralAmountDelta: bigint, // borrowedCollateralAmount
      loanAmount: bigint,
      expectedInterest: bigint,
      swapData: `0x${string}`,
      slippage: number,
    ): Promise<void> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        setConfirmation({
          title: `Borrowing more ${position.underlying.symbol}`,
          body: 'Please confirm in your wallet.',
          fields: [
            {
              currency: position.collateral.underlying,
              label: `Borrow ${position.collateral.underlying.symbol}`,
              value: formatUnits(
                collateralAmountDelta,
                position.collateral.underlying.decimals,
                prices[position.collateral.underlying.address],
              ),
            },
          ],
        })
        await adjust({
          position,
          newDebtAmount: position.amount + loanAmount + expectedInterest,
          expectedInterest,
          newCollateralAmount:
            position.collateralAmount +
            applyPercent(collateralAmountDelta, 100 - slippage),
          swapParams: {
            inSubstitute: position.substitute.address,
            amount: loanAmount,
            data: swapData,
          },
        })
        await queryClient.invalidateQueries(['loan-positions'])
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [walletClient, setConfirmation, prices, adjust, queryClient],
  )

  const extendLoanDuration = useCallback(
    async (
      position: LoanPosition,
      extendedEpoch: number,
      expectedInterest: bigint,
    ): Promise<void> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        setConfirmation({
          title: `Extending loan duration with interest`,
          body: 'Please confirm in your wallet.',
          fields: [],
        })

        await adjust({
          position,
          newDebtAmount: position.amount + expectedInterest,
          expectedInterest,
          newToEpoch: position.toEpoch.id + extendedEpoch,
        })
        await queryClient.invalidateQueries(['loan-positions'])
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [walletClient, setConfirmation, adjust, queryClient],
  )

  const shortenLoanDuration = useCallback(
    async (
      position: LoanPosition,
      shortenedEpoch: number,
      expectedProceeds: bigint,
    ): Promise<void> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        setConfirmation({
          title: `Shortening loan duration with refund`,
          body: 'Please confirm in your wallet.',
          fields: [],
        })
        await adjust({
          position,
          newDebtAmount: max(position.amount - expectedProceeds, 0n),
          expectedProceeds,
          newToEpoch: position.toEpoch.id - shortenedEpoch,
        })
        await queryClient.invalidateQueries(['loan-positions'])
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [walletClient, setConfirmation, adjust, queryClient],
  )

  const addCollateral = useCallback(
    async (position: LoanPosition, amount: bigint): Promise<void> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        const { ethValue, permitAmount } = calculatePermitAmount(
          position.collateral.underlying,
          amount,
        )

        setConfirmation({
          title: `Adding collateral`,
          body: 'Please confirm in your wallet.',
          fields: [
            {
              direction: 'in',
              currency: toWrapETH(position.collateral.underlying),
              label: toWrapETH(position.collateral.underlying).symbol,
              value: formatUnits(
                permitAmount,
                position.collateral.underlying.decimals,
                prices[position.collateral.underlying.address],
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
                prices[position.collateral.underlying.address],
              ),
            },
          ],
        })
        await adjust({
          position,
          newCollateralAmount: position.collateralAmount + amount,
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
      calculatePermitAmount,
      selectedChain.nativeCurrency,
      setConfirmation,
      prices,
      adjust,
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
        await adjust({
          position,
          newCollateralAmount: max(position.collateralAmount - amount, 0n),
        })
        await queryClient.invalidateQueries(['loan-positions'])
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [walletClient, setConfirmation, prices, adjust, queryClient],
  )

  const closeLeveragePosition = useCallback(
    async (position: LoanPosition): Promise<void> => {
      if (!walletClient || !feeData || !feeData.gasPrice) {
        // TODO: alert wallet connect
        return
      }

      // show dummy confirmation until api is ready
      setConfirmation({
        title: `Closing leverage position`,
        body: 'Please wait...',
        fields: [],
      })

      const SLIPPAGE_LIMIT_PERCENT = 0.5
      const { amountOut: repaidCollateralAmount } = await fetchAmountOutByOdos({
        chainId: selectedChain.id,
        amountIn: position.amount,
        tokenIn: position.underlying.address,
        tokenOut: position.collateral.underlying.address,
        slippageLimitPercent: SLIPPAGE_LIMIT_PERCENT,
        userAddress:
          CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
        gasPrice: Number(feeData.gasPrice),
      })
      const amountIn = applyPercent(
        repaidCollateralAmount,
        100 + SLIPPAGE_LIMIT_PERCENT,
      )
      const { pathId, amountOut: repaidDebtAmount } =
        await fetchAmountOutByOdos({
          chainId: selectedChain.id,
          amountIn,
          tokenIn: position.collateral.underlying.address,
          tokenOut: position.underlying.address,
          slippageLimitPercent: SLIPPAGE_LIMIT_PERCENT,
          userAddress:
            CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
          gasPrice: Number(feeData.gasPrice),
        })
      if (pathId) {
        const { data: swapData } = await fetchCallDataByOdos({
          pathId,
          userAddress:
            CONTRACT_ADDRESSES[selectedChain.id as CHAIN_IDS].BorrowController,
        })
        const dust = max(repaidDebtAmount - position.amount, 0n)
        try {
          setConfirmation({
            title: `Closing leverage position`,
            body: 'Please confirm in your wallet.',
            fields: [
              {
                direction: 'out',
                currency: position.collateral.underlying,
                label: position.collateral.underlying.symbol,
                value: formatUnits(
                  position.collateralAmount - amountIn,
                  position.collateral.underlying.decimals,
                  prices[position.collateral.underlying.address],
                ),
              },
              {
                direction: 'out',
                currency: position.underlying,
                label: position.underlying.symbol,
                value: formatUnits(
                  dust,
                  position.underlying.decimals,
                  prices[position.underlying.address],
                ),
              },
            ],
          })
          await adjust({
            position,
            newCollateralAmount: 0n,
            newDebtAmount: 0n,
            swapParams: {
              inSubstitute: position.collateral.substitute.address,
              amount: amountIn,
              data: swapData,
            },
          })
          await queryClient.invalidateQueries(['loan-positions'])
        } catch (e) {
          console.error(e)
        } finally {
          await queryClient.invalidateQueries(['balances'])
          setConfirmation(undefined)
        }
      }
    },
    [
      walletClient,
      feeData,
      setConfirmation,
      selectedChain.id,
      prices,
      adjust,
      queryClient,
    ],
  )

  return (
    <Context.Provider
      value={{
        positions,
        liquidationHistories,
        pnls: pnls ?? {},
        multipleFactors: multipleFactors ?? {},
        borrow,
        leverage,
        repay,
        repayWithCollateral,
        borrowMore,
        leverageMore,
        extendLoanDuration,
        shortenLoanDuration,
        addCollateral,
        removeCollateral,
        closeLeveragePosition,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useBorrowContext = () => React.useContext(Context) as BorrowContext
