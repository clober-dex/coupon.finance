import { Chain } from 'wagmi'
import { arbitrum } from 'viem/chains'

import { couponFinanceChain } from './dev-chain'

export const supportChains: Chain[] =
  process.env.BUILD === 'dev' ? [couponFinanceChain] : [arbitrum]

export enum CHAIN_IDS {
  ARBITRUM = 42161,
  COUPON_FINANCE_CHAIN = 7777,
}

export const CHAINS: {
  [chain in CHAIN_IDS]: Chain
} = {
  [CHAIN_IDS.ARBITRUM]: arbitrum,
  [CHAIN_IDS.COUPON_FINANCE_CHAIN]: couponFinanceChain,
}
