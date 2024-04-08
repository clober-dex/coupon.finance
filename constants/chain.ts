import { Chain } from 'wagmi'
import { arbitrum } from 'viem/chains'

import { arbitrumSepolia } from './dev-chain'

export const supportChains: Chain[] =
  process.env.BUILD === 'dev' ? [arbitrumSepolia] : [arbitrum]

export enum CHAIN_IDS {
  ARBITRUM = arbitrum.id,
  ARBITRUM_SEPOLIA = arbitrumSepolia.id,
}

export const CHAINS: {
  [chain in CHAIN_IDS]: Chain
} = {
  [CHAIN_IDS.ARBITRUM]: arbitrum,
  [CHAIN_IDS.ARBITRUM_SEPOLIA]: arbitrumSepolia,
}
