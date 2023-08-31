type Build = 'dev' | 'prod'

const BUILD: Build = process.env.BUILD as Build

export const CONTRACT_ADDRESSES: {
  BondPositionManager: `0x${string}`
  BorrowController: `0x${string}`
  CouponOracle: `0x${string}`
  DepositController: `0x${string}`
  OdosRepayAdapter: `0x${string}`
} = {
  prod: {
    BondPositionManager:
      '0x0000000000000000000000000000000000000000' as `0x${string}`,
    BorrowController:
      '0x0000000000000000000000000000000000000000' as `0x${string}`,
    CouponOracle: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    DepositController:
      '0x0000000000000000000000000000000000000000' as `0x${string}`,
    OdosRepayAdapter:
      '0x0000000000000000000000000000000000000000' as `0x${string}`,
  },
  dev: {
    BondPositionManager:
      '0x00644a534bDea310ee2FCCF1c2821Df769A0b12F' as `0x${string}`,
    BorrowController:
      '0x242552D7AF567c2Ce1c403D13908d7dC1e0eEfB9' as `0x${string}`,
    CouponOracle: '0x8831c769874fF23ED5DF0daacfD84Cc147335506' as `0x${string}`,
    DepositController:
      '0xDbAb42F029333BF720814732Bb3e3D74c074B558' as `0x${string}`,
    OdosRepayAdapter:
      '0x06ad1569cc3f430D16f906D21Cd2D1DA6eCA8e48' as `0x${string}`,
  },
}[BUILD]
