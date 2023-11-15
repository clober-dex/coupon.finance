import {
  Hash,
  PublicClient,
  SimulateContractParameters,
  WriteContractParameters,
} from 'viem'
import { GetWalletClientResult } from '@wagmi/core'

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
    const { request } = await publicClient.simulateContract(
      args as SimulateContractParameters,
    )
    const hash = await walletClient.writeContract(request)
    await publicClient.waitForTransactionReceipt({
      hash,
    })
    return hash
  } else {
    const hash = await walletClient.writeContract(
      args as WriteContractParameters,
    )
    await publicClient.waitForTransactionReceipt({
      hash,
    })
    return hash
  }
}
