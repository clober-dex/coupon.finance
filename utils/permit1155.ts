import { GetWalletClientResult, readContracts } from '@wagmi/core'
import { createPublicClient, hexToSignature, http } from 'viem'

import { CHAIN_IDS, CHAINS } from '../constants/chain'
import { ERC1155_ABI } from '../abis/@openzeppelin/erc1155-abi'
import { EIP712_ABI } from '../abis/@openzeppelin/eip712-abi'
import { ERC1155_PERMIT_ABI } from '../abis/core/libraries/erc1155-permit-abi'

import { zeroBytes32 } from './bytes'

async function fetchApproval(
  chainId: CHAIN_IDS,
  erc1155ContractAddress: `0x${string}`,
  owner: `0x${string}`,
  spender: `0x${string}`,
): Promise<boolean | undefined> {
  const publicClient = createPublicClient({
    chain: CHAINS[chainId as CHAIN_IDS],
    transport: http(),
  })
  const [{ result: approval }] = await publicClient.multicall({
    contracts: [
      {
        address: erc1155ContractAddress,
        abi: ERC1155_ABI,
        functionName: 'isApprovedForAll',
        args: [owner, spender],
      },
    ],
  })
  return approval
}

export const permit1155 = async (
  chainId: CHAIN_IDS,
  walletClient: GetWalletClientResult,
  erc1155ContractAddress: `0x${string}`,
  owner: `0x${string}`,
  spender: `0x${string}`,
  deadline: bigint,
): Promise<{
  r: `0x${string}`
  s: `0x${string}`
  v: number
  deadline: bigint
}> => {
  const isApproval = await fetchApproval(
    chainId,
    erc1155ContractAddress,
    owner,
    spender,
  )
  if (!walletClient || isApproval) {
    return {
      r: zeroBytes32 as `0x${string}`,
      s: zeroBytes32 as `0x${string}`,
      v: 0,
      deadline: 0n,
    }
  }

  const [{ result: nonce }, { result: eip712Domain }] = await readContracts({
    allowFailure: true,
    contracts: [
      {
        address: erc1155ContractAddress,
        abi: ERC1155_PERMIT_ABI,
        functionName: 'nonces',
        args: [owner],
      },
      {
        address: erc1155ContractAddress,
        abi: EIP712_ABI,
        functionName: 'eip712Domain',
      },
    ],
  })

  if (nonce === undefined || !eip712Domain) {
    throw new Error('Could not fetch eip712Domain')
  }

  const signature = await walletClient.signTypedData({
    account: owner,
    domain: {
      name: eip712Domain[1],
      version: eip712Domain[2].toString(),
      chainId: BigInt(walletClient.chain.id),
      verifyingContract: erc1155ContractAddress,
    },
    message: {
      owner,
      operator: spender,
      approved: true,
      nonce,
      deadline,
    },
    primaryType: 'Permit',
    types: {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'operator', type: 'address' },
        { name: 'approved', type: 'bool' },
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
}
