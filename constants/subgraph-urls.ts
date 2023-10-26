import { CHAINS } from './chain'

export const SUBGRAPH_URLS: {
  [chain in CHAINS]: string
} = {
  [CHAINS.ARBITRUM]: '',
  [CHAINS.COUPON_FINANCE_CHAIN]:
    'https://dev-subgraph.coupon.finance/subgraphs/name/coupon-subgraph',
}
