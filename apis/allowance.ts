import { createPublicClient, http } from 'viem'

import { Currency } from '../model/currency'
import { CHAIN_IDS, CHAINS } from '../constants/chain'
import { ERC20_PERMIT_ABI } from '../abis/@openzeppelin/erc20-permit-abi'

export async function fetchAllowance(
  chainId: CHAIN_IDS,
  currency: Currency,
  userAddress: `0x${string}`,
  spenderAddress: `0x${string}`,
): Promise<bigint> {
  const publicClient = createPublicClient({
    chain: CHAINS[chainId as CHAIN_IDS],
    transport: http(),
  })
  const [{ result: allowance }] = await publicClient.multicall({
    contracts: [
      {
        address: currency.address,
        abi: ERC20_PERMIT_ABI,
        functionName: 'allowance',
        args: [userAddress, spenderAddress],
      },
    ],
  })
  return allowance || 0n
}
