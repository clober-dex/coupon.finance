import React, { useCallback } from 'react'
import { Hash, isAddressEqual } from 'viem'
import {
  useAccount,
  useBalance,
  usePublicClient,
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

import { isEthereum, useCurrencyContext } from './currency-context'
import { useTransactionContext } from './transaction-context'

type BorrowContext = {
  // TODO: change to bigInt
  positions: {
    currency: Currency
    apy: string
    borrowed: string
    collateral: string
    collateralSymbol: string
    expiry: string
    price: string
    collateralPrice: string
    ltv: string
    liquidationThreshold: string
  }[]
  apy: { [key in `0x${string}`]: number }
  available: { [key in `0x${string}`]: bigint }
  borrowed: { [key in `0x${string}`]: bigint }
  borrow: (
    collateral: Currency,
    collateralAmount: bigint,
    loanAsset: Asset,
    loanAmount: bigint,
    epochs: number,
    expectedInterest: bigint,
  ) => Promise<Hash | undefined>
}

const Context = React.createContext<BorrowContext>({
  positions: [],
  apy: {},
  available: {},
  borrowed: {},
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

  const dummyPositions = [
    {
      currency: {
        address: '0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9' as `0x${string}`,
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
      apy: '5.00%',
      borrowed: '69.00',
      collateral: '69.00',
      collateralSymbol: 'USDC',
      expiry: '12/12/2021',
      price: '2000.00',
      collateralPrice: '1.00',
      ltv: '50%',
      liquidationThreshold: '60%',
    },
    {
      currency: {
        address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' as `0x${string}`,
        name: 'Arbitrum',
        symbol: 'ARB',
        decimals: 18,
      },
      apy: '5.00%',
      borrowed: '42.00',
      collateral: '42.00',
      collateralSymbol: 'USDC',
      deposited: '42.00',
      expiry: '12/12/2021',
      price: '30000.00',
      collateralPrice: '1.00',
      ltv: '50%',
      liquidationThreshold: '60%',
    },
  ]

  // TODO: get apy from order book
  const apy: {
    [key in `0x${string}`]: number
  } = {}

  // TODO: get available
  const available: {
    [key in `0x${string}`]: bigint
  } = {}

  // TODO: get borrowed
  const borrowed: {
    [key in `0x${string}`]: bigint
  } = {}

  const borrow = useCallback(
    async (
      collateral: Currency,
      collateralAmount: bigint,
      loan: Asset,
      loanAmount: bigint,
      epochs: number,
      expectedInterest: bigint,
    ): Promise<Hash | undefined> => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      const maximumInterestPaid = BigInt(
        Math.floor(Number(expectedInterest) * (1 + SLIPPAGE_PERCENTAGE)),
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
        positions: dummyPositions,
        apy,
        available,
        borrowed,
        borrow,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useBorrowContext = () => React.useContext(Context) as BorrowContext
