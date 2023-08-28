import React, { useCallback } from 'react'
import { usePublicClient, useWalletClient } from 'wagmi'
import { hexToSignature } from 'viem'
import { readContracts } from '@wagmi/core'

import { zeroBytes32 } from '../utils/bytes'
import { IERC20Metadata__factory, IERC20Permit__factory } from '../typechain'
import { fetchAllowance } from '../api/allowance'
import { Currency } from '../model/currency'

type PermitContext = {
  permit: (
    asset: Currency,
    owner: `0x${string}`,
    spender: `0x${string}`,
    value: bigint,
    deadline: bigint,
  ) => Promise<{
    r: `0x${string}`
    s: `0x${string}`
    v: number
    deadline: bigint
  }>
}

const Context = React.createContext<PermitContext>({
  permit: () =>
    Promise.resolve({
      r: zeroBytes32 as `0x${string}`,
      s: zeroBytes32 as `0x${string}`,
      v: 0,
      deadline: 0n,
    }),
})

export const PermitProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { data: walletClient } = useWalletClient()

  const permit = useCallback(
    async (
      currency: Currency,
      owner: `0x${string}`,
      spender: `0x${string}`,
      value: bigint,
      deadline: bigint,
    ): Promise<{
      r: `0x${string}`
      s: `0x${string}`
      v: number
      deadline: bigint
    }> => {
      const allowance = await fetchAllowance(currency, owner, spender)
      if (!walletClient || allowance >= value) {
        return {
          r: zeroBytes32 as `0x${string}`,
          s: zeroBytes32 as `0x${string}`,
          v: 0,
          deadline: 0n,
        }
      }

      const [{ result: nonce }, { result: version }, { result: name }] =
        await readContracts({
          allowFailure: true,
          contracts: [
            {
              address: currency.address,
              abi: IERC20Permit__factory.abi,
              functionName: 'nonces',
              args: [owner],
            },
            {
              address: currency.address,
              abi: [
                {
                  inputs: [],
                  name: 'version',
                  outputs: [
                    {
                      internalType: 'string',
                      name: '',
                      type: 'string',
                    },
                  ],
                  stateMutability: 'view',
                  type: 'function',
                },
              ],
              functionName: 'version',
            },
            {
              address: currency.address,
              abi: IERC20Metadata__factory.abi,
              functionName: 'name',
            },
          ],
        })

      const signature = await walletClient.signTypedData({
        account: owner,
        domain: {
          name: name || 'ERC20 Permit',
          version: (version || '1').toString(),
          chainId: BigInt(walletClient.chain.id),
          verifyingContract: currency.address,
        },
        message: {
          owner,
          spender,
          value,
          nonce: nonce || 0n,
          deadline,
        },
        primaryType: 'Permit',
        types: {
          Permit: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
          ],
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
        },
      })

      const { v, s, r } = hexToSignature(signature)
      return {
        v: Number(v),
        s: s as `0x${string}`,
        r: r as `0x${string}`,
        deadline,
      }
    },
    [walletClient],
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
