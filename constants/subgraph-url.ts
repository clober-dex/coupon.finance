import { CHAIN_IDS } from './chain'

export const SUBGRAPH_URL: {
  [chain in CHAIN_IDS]: string
} = {
  [CHAIN_IDS.ARBITRUM]:
    'https://api.studio.thegraph.com/query/49804/coupon-subgraph/v1.0.1',
  [CHAIN_IDS.COUPON_FINANCE_CHAIN]:
    'https://dev-subgraph.coupon.finance/subgraphs/name/coupon-subgraph',
}

export const POINT_SUBGRAPH_URL: {
  [chain in CHAIN_IDS]: string
} = {
  [CHAIN_IDS.ARBITRUM]:
    'https://api.studio.thegraph.com/query/49804/coupon-point-subgraph/v1',
  [CHAIN_IDS.COUPON_FINANCE_CHAIN]:
    'https://dev-subgraph.coupon.finance/subgraphs/name/coupon-point-subgraph',
}
