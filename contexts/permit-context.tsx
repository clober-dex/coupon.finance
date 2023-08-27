import React, { useCallback } from 'react'
import { usePublicClient, useWalletClient } from 'wagmi'
import { hexToSignature } from 'viem'

import { Currency } from '../model/currency'
import { zeroBytes32 } from '../utils/bytes'

import { useCurrencyContext } from './currency-context'

type PermitContext = {
  permit: (
    asset: Currency,
    owner: `0x${string}`,
    spender: `0x${string}`,
    value: bigint,
    deadline: number,
  ) => Promise<{
    r: `0x${string}`
    s: `0x${string}`
    v: number
  }>
}

const Context = React.createContext<PermitContext>({
  permit: () =>
    Promise.resolve({
      r: zeroBytes32 as `0x${string}`,
      s: zeroBytes32 as `0x${string}`,
      v: 0,
    }),
})

export const PermitProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { allowances, invalidateAllowances } = useCurrencyContext()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  const permit = useCallback(
    async (
      asset: Currency,
      owner: `0x${string}`,
      spender: `0x${string}`,
      value: bigint,
      deadline: number,
    ): Promise<{
      r: `0x${string}`
      s: `0x${string}`
      v: number
    }> => {
      if (!walletClient || allowances[spender][asset.address] >= value) {
        return {
          r: zeroBytes32 as `0x${string}`,
          s: zeroBytes32 as `0x${string}`,
          v: 0,
        }
      }

      const domain = {
        name: asset.name,
        version: '4',
        chainId: walletClient.chain.id,
        verifyingContract: asset.address,
      }

      const types = {
        Permit: [
          {
            name: 'owner',
            type: 'address',
          },
          {
            name: 'spender',
            type: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
          },
          {
            name: 'nonce',
            type: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
          },
        ],
      }

      const nonce = await publicClient.getTransactionCount({
        address: owner,
      })
      const message = {
        owner,
        spender,
        value,
        nonce,
        deadline,
      }

      const signature = await walletClient.signTypedData({
        account: owner,
        domain,
        message,
        primaryType: 'Permit',
        types,
      })

      invalidateAllowances()

      const { v, s, r } = hexToSignature(signature)
      return {
        v: Number(v),
        s,
        r,
      }
    },
    [allowances, invalidateAllowances, publicClient, walletClient],
  )

  return (
    <Context.Provider
      value={{
        permit,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const usePermitContext = () => React.useContext(Context) as PermitContext
