import { Currency } from '../model/currency'

import { CHAIN_IDS } from './chain'

export const ETH_CURRENCY: {
  [chain in CHAIN_IDS]: Currency
} = {
  [CHAIN_IDS.ARBITRUM]: {
    address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  [CHAIN_IDS.COUPON_FINANCE_CHAIN]: {
    address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
}
