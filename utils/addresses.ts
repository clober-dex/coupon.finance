type Build = 'dev' | 'prod'

const BUILD: Build = process.env.BUILD as Build

export const CONTRACT_ADDRESSES: {
  BondPositionManager: `0x${string}`
  BorrowController: `0x${string}`
  CouponOracle: `0x${string}`
  DepositController: `0x${string}`
  LoanPositionManager: `0x${string}`
  OdosRepayAdapter: `0x${string}`
} = {
  prod: {
    BondPositionManager:
      '0x06ad1569cc3f430D16f906D21Cd2D1DA6eCA8e48' as `0x${string}`,
    BorrowController:
      '0xf989cF31a0C30c766C7f81Eb71b1Df518e7E9EBA' as `0x${string}`,
    CouponOracle: '0xE0dBCB42CCAc63C949cE3EF879A647DDb662916d' as `0x${string}`,
    DepositController:
      '0x724D0757261c4d0461A0fd71929e080447162148' as `0x${string}`,
    LoanPositionManager:
      '0xDAC1D90536df1390E599534B6A6F5Fe35c907e20' as `0x${string}`,
    OdosRepayAdapter:
      '0x1b2820D628F83b65126Ff591F468c960220E2594' as `0x${string}`,
  },
  dev: {
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
}[BUILD]
