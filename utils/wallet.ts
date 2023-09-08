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
    return walletClient.writeContract(request)
  } else {
    return walletClient.writeContract(args as WriteContractParameters)
  }
}
