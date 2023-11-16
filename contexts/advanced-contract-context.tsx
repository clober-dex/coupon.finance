import React, { useCallback } from 'react'
import { usePublicClient, useQueryClient, useWalletClient } from 'wagmi'

import { Currency } from '../model/currency'
import { formatUnits } from '../utils/numbers'
import { writeContract } from '../utils/wallet'
import { ISubstitute__factory } from '../typechain'
import { approve20 } from '../utils/approve20'

import { useTransactionContext } from './transaction-context'
import { useCurrencyContext } from './currency-context'
import { useChainContext } from './chain-context'

type AdvancedContractContext = {
  mintSubstitute: (
    underlying: Currency,
    substitute: Currency,
    amount: bigint,
  ) => Promise<void>
  burnSubstitute: (
    substitute: Currency,
    underlying: Currency,
    amount: bigint,
  ) => Promise<void>
  mintCoupon: (
    underlying: Currency,
    coupon: Currency,
    amount: bigint,
  ) => Promise<void>
  burnCoupon: (
    underlying: Currency,
    coupon: Currency,
    amount: bigint,
  ) => Promise<void>
}

const Context = React.createContext<AdvancedContractContext>({
  mintSubstitute: () => Promise.resolve(),
  burnSubstitute: () => Promise.resolve(),
  mintCoupon: () => Promise.resolve(),
  burnCoupon: () => Promise.resolve(),
})

export const AdvancedContractProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const queryClient = useQueryClient()
  const { prices } = useCurrencyContext()
  const { selectedChain } = useChainContext()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { setConfirmation } = useTransactionContext()

  const mintSubstitute = useCallback(
    async (underlying: Currency, substitute: Currency, amount: bigint) => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        await approve20(
          selectedChain.id,
          walletClient,
          underlying,
          walletClient.account.address,
          substitute.address,
          amount,
        )
        setConfirmation({
          title: 'Minting Substitute',
          body: 'Please confirm in your wallet.',
          fields: [
            {
              direction: 'in',
              currency: underlying,
              label: underlying.symbol,
              value: formatUnits(
                amount,
                underlying.decimals,
                prices[underlying.address],
              ),
            },
            {
              direction: 'out',
              currency: substitute,
              label: substitute.symbol,
              value: formatUnits(
                amount,
                substitute.decimals,
                prices[substitute.address],
              ),
            },
          ],
        })
        await writeContract(publicClient, walletClient, {
          address: substitute.address,
          abi: ISubstitute__factory.abi,
          functionName: 'mint',
          args: [amount, walletClient.account.address],
          account: walletClient.account,
        })
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [
      prices,
      publicClient,
      queryClient,
      selectedChain.id,
      setConfirmation,
      walletClient,
    ],
  )

  const burnSubstitute = useCallback(
    async (substitute: Currency, underlying: Currency, amount: bigint) => {
      if (!walletClient) {
        // TODO: alert wallet connect
        return
      }

      try {
        setConfirmation({
          title: 'Burning Substitute',
          body: 'Please confirm in your wallet.',
          fields: [
            {
              direction: 'in',
              currency: substitute,
              label: substitute.symbol,
              value: formatUnits(
                amount,
                substitute.decimals,
                prices[substitute.address],
              ),
            },
            {
              direction: 'out',
              currency: underlying,
              label: underlying.symbol,
              value: formatUnits(
                amount,
                underlying.decimals,
                prices[underlying.address],
              ),
            },
          ],
        })
        await writeContract(publicClient, walletClient, {
          address: substitute.address,
          abi: ISubstitute__factory.abi,
          functionName: 'burn',
          args: [amount, walletClient.account.address],
          account: walletClient.account,
        })
      } catch (e) {
        console.error(e)
      } finally {
        await queryClient.invalidateQueries(['balances'])
        setConfirmation(undefined)
      }
    },
    [prices, publicClient, queryClient, setConfirmation, walletClient],
  )

  const mintCoupon = useCallback(async () => {
    if (!walletClient) {
      // TODO: alert wallet connect
      return
    }

    try {
      console.log('minting coupon')
    } catch (e) {
      console.error(e)
    } finally {
      await Promise.all([
        queryClient.invalidateQueries(['balances']),
        queryClient.invalidateQueries(['coupons']),
      ])
      setConfirmation(undefined)
    }
  }, [queryClient, setConfirmation, walletClient])

  const burnCoupon = useCallback(async () => {
    if (!walletClient) {
      // TODO: alert wallet connect
      return
    }

    try {
      console.log('burning coupon')
    } catch (e) {
      console.error(e)
    } finally {
      await Promise.all([
        queryClient.invalidateQueries(['balances']),
        queryClient.invalidateQueries(['coupons']),
      ])
      setConfirmation(undefined)
    }
  }, [queryClient, setConfirmation, walletClient])

  return (
    <Context.Provider
      value={{
        mintSubstitute,
        burnSubstitute,
        mintCoupon,
        burnCoupon,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useAdvancedContractContext = () =>
  React.useContext(Context) as AdvancedContractContext
