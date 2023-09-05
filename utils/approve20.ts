import { GetWalletClientResult } from '@wagmi/core'
import { Hash } from 'viem'

import { Currency } from '../model/currency'
import { fetchAllowance } from '../api/allowance'
import { IERC20__factory } from '../typechain'

export const approve20 = async (
  walletClient: GetWalletClientResult,
  currency: Currency,
  owner: `0x${string}`,
  spender: `0x${string}`,
  value: bigint,
): Promise<`0x${string}` | undefined> => {
  const allowance = await fetchAllowance(currency, owner, spender)
  if (!walletClient || allowance >= value) {
    return
  }
  const hash = await walletClient.writeContract({
    address: currency.address,
    abi: IERC20__factory.abi,
    functionName: 'approve',
    args: [spender, value],
    account: walletClient.account,
  })
  return hash
}
