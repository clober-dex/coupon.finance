import { CHAIN_IDS } from './chain'

export const CONTRACT_ADDRESSES: {
  [chain in CHAIN_IDS]: {
    BondPositionManager: `0x${string}`
    BorrowController: `0x${string}`
    CouponOracle: `0x${string}`
    DepositController: `0x${string}`
    LoanPositionManager: `0x${string}`
    OdosRepayAdapter: `0x${string}`
  }
} = {
  [CHAIN_IDS.ARBITRUM]: {
    BondPositionManager:
      '0x0000000000000000000000000000000000000000' as `0x${string}`,
    BorrowController:
      '0x0000000000000000000000000000000000000000' as `0x${string}`,
    CouponOracle: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    DepositController:
      '0x0000000000000000000000000000000000000000' as `0x${string}`,
    LoanPositionManager:
      '0x0000000000000000000000000000000000000000' as `0x${string}`,
    OdosRepayAdapter:
      '0x0000000000000000000000000000000000000000' as `0x${string}`,
  },
  [CHAIN_IDS.COUPON_FINANCE_CHAIN]: {
    BondPositionManager:
      '0x98C0a86096b508Fae31Ba2aF94E4EDcc29D8001E' as `0x${string}`,
    BorrowController:
      '0xeDF96D4Bb8905bfdb215F480239203d8B7088014' as `0x${string}`,
    CouponOracle: '0xbaF0FF012884917b1FCb2222d6e6D75Eb795D23B' as `0x${string}`,
    DepositController:
      '0x110FE0aAEa38A682732ec185E114Ae44114D13EF' as `0x${string}`,
    LoanPositionManager:
      '0xa87224d1F96cA183CE119f94b6e48035c93B05Fb' as `0x${string}`,
    OdosRepayAdapter:
      '0xc8112f1084168d8168dcef5543FE7a4C3ed21aD6' as `0x${string}`,
  },
}
