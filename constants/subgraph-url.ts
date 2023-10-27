import { CHAIN_IDS } from './chain'

export const SUBGRAPH_URL: {
  [chain in CHAIN_IDS]: string
} = {
  [CHAIN_IDS.ARBITRUM]: '',
  [CHAIN_IDS.COUPON_FINANCE_CHAIN]:
    'https://dev-subgraph.coupon.finance/subgraphs/name/coupon-subgraph',
}
