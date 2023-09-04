import React, { useCallback } from 'react'
import { Hash, isAddressEqual } from 'viem'
import {
  useAccount,
  useBalance,
  usePublicClient,
  useQuery,
  useQueryClient,
  useWalletClient,
} from 'wagmi'
import { AddressZero } from '@ethersproject/constants'

import { Currency } from '../model/currency'
import { Asset } from '../model/asset'
import { permit20 } from '../utils/permit20'
import { CONTRACT_ADDRESSES } from '../utils/addresses'
import { formatUnits } from '../utils/numbers'
import { BorrowController__factory } from '../typechain'
import { max } from '../utils/bigint'
import { fetchLoanPositions } from '../api/loan-position'
import { LoanPosition } from '../model/loan-position'

import { isEthereum, useCurrencyContext } from './currency-context'
import { useTransactionContext } from './transaction-context'

type BorrowContext = {
  positions: LoanPosition[]
  borrow: (
    collateral: Currency,
    collateralAmount: bigint,
    loanAsset: Asset,
    loanAmount: bigint,
    epochs: number,
    expectedInterests: bigint,
  ) => Promise<Hash | undefined>
}

const Context = React.createContext<BorrowContext>({
  positions: [],
  borrow: () => Promise.resolve(undefined),
})

const SLIPPAGE_PERCENTAGE = 0.0005 // 0.05%

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
      collateral: Currency,
      collateralAmount: bigint,
      loan: Asset,
      loanAmount: bigint,
      epochs: number,
      expectedInterests: bigint,
    ): Promise<Hash | undefined> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      const maximumInterestPaid = BigInt(
        Math.floor(Number(expectedInterests) * (1 + SLIPPAGE_PERCENTAGE)),
      )
      const wethBalance = isEthereum(collateral)
        ? balances[collateral.address] - (balance?.value || 0n)
        : 0n
      const collateralSubstituteAddress =
        loan.collaterals.find(({ underlying }) =>
          isAddressEqual(underlying.address, collateral.address),
        )?.substitute.address || AddressZero

      let hash: Hash | undefined
      try {
        const { deadline, r, s, v } = await permit20(
          walletClient,
          collateral,
          walletClient.account.address,
          CONTRACT_ADDRESSES.BorrowController,
          collateralAmount,
          BigInt(Math.floor(new Date().getTime() / 1000 + 60 * 60 * 24)),
        )
        setConfirmation({
          title: 'Making Borrow',
          body: 'Please confirm in your wallet.',
          fields: [
            {
              currency: collateral,
              label: collateral.symbol,
              value: formatUnits(collateralAmount, collateral.decimals),
            },
            {
              currency: loan.underlying,
              label: loan.underlying.symbol,
              value: formatUnits(loanAmount, loan.underlying.decimals),
            },
          ],
        })
        const { request } = await publicClient.simulateContract({
          address: CONTRACT_ADDRESSES.BorrowController,
          abi: BorrowController__factory.abi,
          functionName: 'borrow',
          args: [
            collateralSubstituteAddress,
            loan.substitutes[0].address,
            collateralAmount,
            loanAmount + maximumInterestPaid,
            maximumInterestPaid,
            epochs,
            { deadline, v, r, s },
          ],
          value: isEthereum(collateral)
            ? max(collateralAmount - wethBalance, 0n)
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

  return (
    <Context.Provider
      value={{
        positions,
        borrow,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useBorrowContext = () => React.useContext(Context) as BorrowContext
