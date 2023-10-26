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
      '0xA0D476c6A39beA239749C566a02343e5584Ec200' as `0x${string}`,
    BorrowController:
      '0x929075bdc8cf2e43cA7FB4BF1a189130b6014Cc1' as `0x${string}`,
    CouponOracle: '0xb523dFFc24220A18eB035A50b17Da69E4daea480' as `0x${string}`,
    DepositController:
      '0x92bb5C37868C5B34B163FeFAb4e20b1179853eB9' as `0x${string}`,
    LoanPositionManager:
      '0x8831c769874fF23ED5DF0daacfD84Cc147335506' as `0x${string}`,
    OdosRepayAdapter:
      '0x00644a534bDea310ee2FCCF1c2821Df769A0b12F' as `0x${string}`,
  },
}
