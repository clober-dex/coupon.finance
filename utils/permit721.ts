import { GetWalletClientResult, readContracts } from '@wagmi/core'
import { hexToSignature, isAddressEqual, zeroAddress } from 'viem'

import { fetchApproval } from '../apis/approval'
import { EIP712__factory, IERC721Permit__factory } from '../typechain'
import { CHAIN_IDS } from '../constants/chain'

import { zeroBytes32 } from './bytes'

export const permit721 = async (
  chainId: CHAIN_IDS,
  walletClient: GetWalletClientResult,
  nftContractAddress: `0x${string}`,
  tokenId: bigint,
  owner: `0x${string}`,
  spender: `0x${string}`,
  deadline: bigint,
): Promise<{
  r: `0x${string}`
  s: `0x${string}`
  v: number
  deadline: bigint
}> => {
  const approval = await fetchApproval(chainId, nftContractAddress, tokenId)
  if (!walletClient || isAddressEqual(approval || zeroAddress, spender)) {
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
        address: nftContractAddress,
        abi: IERC721Permit__factory.abi,
        functionName: 'nonces',
        args: [tokenId],
      },
      {
        address: nftContractAddress,
        abi: EIP712__factory.abi,
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
      verifyingContract: nftContractAddress,
    },
    message: {
      spender,
      tokenId,
      nonce,
      deadline,
    },
    primaryType: 'Permit',
    types: {
      Permit: [
        { name: 'spender', type: 'address' },
        { name: 'tokenId', type: 'uint256' },
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
