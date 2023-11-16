import BigNumber from 'bignumber.js'

import { CHAIN_IDS } from './chain'

export const MIN_DEBT_SIZE_IN_ETH: {
  [chain in CHAIN_IDS]: BigNumber
} = {
  [CHAIN_IDS.ARBITRUM]: new BigNumber('0.01'),
  [CHAIN_IDS.COUPON_FINANCE_CHAIN]: new BigNumber('0.001'),
}
