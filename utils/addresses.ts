type Build = 'dev' | 'prod'

const BUILD: Build = process.env.BUILD as Build

export const CONTRACT_ADDRESSES: {
  CouponOracle: `0x${string}`
  DepositController: `0x${string}`
} = {
  prod: {
    CouponOracle: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    DepositController:
      '0x0000000000000000000000000000000000000000' as `0x${string}`,
  },
  dev: {
    CouponOracle: '0x8831c769874fF23ED5DF0daacfD84Cc147335506' as `0x${string}`,
    DepositController:
      '0xDbAb42F029333BF720814732Bb3e3D74c074B558' as `0x${string}`,
  },
}[BUILD]
