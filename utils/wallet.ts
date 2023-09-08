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
  const useSimulator =
    process.env.NEXT_PUBLIC_USE_SIMULATOR !== undefined
      ? process.env.NEXT_PUBLIC_USE_SIMULATOR === 'true'
      : false
  if (useSimulator) {
    const { request } = await publicClient.simulateContract(
      args as SimulateContractParameters,
    )
    const hash = await walletClient.writeContract(request)
    return hash
  } else {
    const hash = await walletClient.writeContract(
      args as WriteContractParameters,
    )
    return hash
  }
}
