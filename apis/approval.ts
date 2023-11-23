import { createPublicClient, http } from 'viem'

import { CHAIN_IDS, CHAINS } from '../constants/chain'
import { ERC721_ABI } from '../abis/@openzeppelin/erc721-abi'

export async function fetchApproval(
  chainId: CHAIN_IDS,
  nftContractAddress: `0x${string}`,
  tokenId: bigint,
): Promise<`0x${string}` | undefined> {
  const publicClient = createPublicClient({
    chain: CHAINS[chainId as CHAIN_IDS],
    transport: http(),
  })
  const [{ result: approval }] = await publicClient.multicall({
    contracts: [
      {
        address: nftContractAddress,
        abi: ERC721_ABI,
        functionName: 'getApproved',
        args: [tokenId],
      },
    ],
  })
  return approval
}
