import {
  Hash,
  PublicClient,
  SimulateContractParameters,
  WriteContractParameters,
} from 'viem'
import { GetWalletClientResult } from '@wagmi/core'

import { max } from './bigint'

const sanitizeBigInt = (args?: any): any => {
  if (!args) {
    return args
  }
  if (typeof args === 'bigint') {
    return max(args, 0n)
  } else if (Array.isArray(args)) {
    return args.map((arg) => sanitizeBigInt(arg))
  } else if (typeof args === 'object') {
    return Object.fromEntries(
      Object.entries(args).map(([key, value]) => [key, sanitizeBigInt(value)]),
    )
  } else {
    return args
  }
}

export async function writeContract(
  publicClient: PublicClient,
  walletClient: GetWalletClientResult,
  args: WriteContractParameters | SimulateContractParameters,
): Promise<Hash | undefined> {
  if (!walletClient) {
    return
  }
  const useSimulate = !(process.env.NEXT_PUBLIC_USE_SIMULATE === 'false')
  if (useSimulate) {
    const { request } = await publicClient.simulateContract({
      ...args,
      args: sanitizeBigInt(args.args),
    } as SimulateContractParameters)
    const hash = await walletClient.writeContract(request)
    await publicClient.waitForTransactionReceipt({
      hash,
    })
    return hash
  } else {
    const hash = await walletClient.writeContract({
      ...args,
      args: sanitizeBigInt(args.args),
    } as WriteContractParameters)
    await publicClient.waitForTransactionReceipt({
      hash,
    })
    return hash
  }
}
