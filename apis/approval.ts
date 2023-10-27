import { createPublicClient, http } from 'viem'

import { IERC721__factory } from '../typechain'
import { CHAIN_IDS, CHAINS } from '../constants/chain'

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
        abi: IERC721__factory.abi,
        functionName: 'getApproved',
        args: [tokenId],
      },
    ],
  })
  return approval
}
