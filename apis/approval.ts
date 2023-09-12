import { readContracts } from '@wagmi/core'

import { IERC721__factory } from '../typechain'

export async function fetchApproval(
  nftContractAddress: `0x${string}`,
  tokenId: bigint,
): Promise<`0x${string}` | undefined> {
  const [{ result: approval }] = await readContracts({
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
