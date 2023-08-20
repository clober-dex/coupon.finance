declare const couponFinanceChain: {
  readonly id: 7777
  readonly name: 'Coupon Finance Chain'
  readonly network: 'coupon-finance-chain'
  readonly nativeCurrency: {
    readonly name: 'Ether'
    readonly symbol: 'ETH'
    readonly decimals: 18
  }
  readonly rpcUrls: {
    readonly default: {
      readonly http: readonly ['http://dev-rpc.coupon.finance']
    }
    readonly public: {
      readonly http: readonly ['http://dev-rpc.coupon.finance']
    }
  }
  readonly blockExplorers: {
    readonly default: {
      readonly name: 'Coupon Finance Explorer'
      readonly url: 'http://dev-rpc.coupon.finance:4000'
    }
  }
  readonly contracts: {
    readonly multicall3: {
      readonly address: '0xca11bde05977b3631167028862be2a173976ca11'
      readonly blockCreated: 7654707
    }
  }
}

export { couponFinanceChain }
