import { GetWalletClientResult } from '@wagmi/core'

import { Currency } from '../model/currency'
import { fetchAllowance } from '../apis/allowance'
import { IERC20__factory } from '../typechain'
import { CHAIN_IDS } from '../constants/chain'

export const approve20 = async (
  chainId: CHAIN_IDS,
  walletClient: GetWalletClientResult,
  currency: Currency,
  owner: `0x${string}`,
  spender: `0x${string}`,
  value: bigint,
): Promise<`0x${string}` | undefined> => {
  const allowance = await fetchAllowance(chainId, currency, owner, spender)
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
