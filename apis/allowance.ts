import { readContracts } from '@wagmi/core'

import { Currency } from '../model/currency'
import { IERC20__factory } from '../typechain'

export async function fetchAllowance(
  currency: Currency,
  userAddress: `0x${string}`,
  spenderAddress: `0x${string}`,
): Promise<bigint> {
  const [{ result: allowance }] = await readContracts({
    contracts: [
      {
        address: currency.address,
        abi: IERC20__factory.abi,
        functionName: 'allowance',
        args: [userAddress, spenderAddress],
      },
    ],
  })
  return allowance || 0n
}
