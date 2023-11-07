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
      '0xC14f853a38444D94f74e05156881BDC154A54D31' as `0x${string}`,
    CouponOracle: '0xbaF0FF012884917b1FCb2222d6e6D75Eb795D23B' as `0x${string}`,
    DepositController:
      '0x64501F8ad7ff7263c17369EBf287E72d0B571567' as `0x${string}`,
    LoanPositionManager:
      '0xa87224d1F96cA183CE119f94b6e48035c93B05Fb' as `0x${string}`,
    OdosRepayAdapter:
      '0x9171E3607dB356975b5d39792657De48a4758B4A' as `0x${string}`,
  },
}
