import { Chain } from 'wagmi'

export const couponFinanceChain: Chain = {
  id: 7777,
  name: 'Coupon Finance Chain',
  network: 'coupon-finance-chain',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://dev-rpc.coupon.finance'],
    },
    public: {
      http: ['https://dev-rpc.coupon.finance'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Coupon Finance Explorer',
      url: 'http://dev-rpc.coupon.finance:4000',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 7654707,
    },
  },
}
