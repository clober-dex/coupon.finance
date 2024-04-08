import { zeroAddress } from 'viem'

import { CHAIN_IDS } from './chain'

export const CONTRACT_ADDRESSES: {
  [chain in CHAIN_IDS]: {
    BondPositionManager: `0x${string}`
    BorrowController: `0x${string}`
    CouponManager: `0x${string}`
    CouponMarketRouter: `0x${string}`
    CouponOracle: `0x${string}`
    CouponWrapper: `0x${string}`
    DepositController: `0x${string}`
    EthSubstituteMinter: `0x${string}`
    LoanPositionManager: `0x${string}`
    SimpleBondController: `0x${string}`
    Wrapped1155Factory: `0x${string}`
  }
} = {
  [CHAIN_IDS.ARBITRUM]: {
    BondPositionManager:
      '0x0Cf91Bc7a67B063142C029a69fF9C8ccd93476E2' as `0x${string}`,
    BorrowController:
      '0x3989557B16fc8dB74CC8Ab0c5981b2396555d3C2' as `0x${string}`,
    CouponManager:
      '0x8bbcA766D175aDbffB073832262990df1c5ef748' as `0x${string}`,
    CouponMarketRouter:
      '0xF7bb8649006E00E849e63f5cbF0887B0E0Dd9d97' as `0x${string}`,
    CouponOracle: '0xF8e9ab02b057978c29Ca57c7E086D46983764A13' as `0x${string}`,
    CouponWrapper:
      '0xc5577988Cc8A49ecF6A48c8e84717E481E3bF57b' as `0x${string}`,
    DepositController:
      '0xE829fDe841c2a4b8dF34D0ebA146c06393D7F322' as `0x${string}`,
    EthSubstituteMinter:
      '0xeA424D3C88aF908769B3292bd88c60E5652b308E' as `0x${string}`,
    LoanPositionManager:
      '0x03d65411684ae7B5440E11a6063881a774C733dF' as `0x${string}`,
    SimpleBondController:
      '0x2EA069EB48De599BBd490a07A2Ea9BD9730F7475' as `0x${string}`,
    Wrapped1155Factory:
      '0xfcBE16BfD991E4949244E59d9b524e6964b8BB75' as `0x${string}`,
  },
  [CHAIN_IDS.ARBITRUM_SEPOLIA]: {
    // TODO: update sepolia addresses
    BondPositionManager:
      '0x0Cf91Bc7a67B063142C029a69fF9C8ccd93476E2' as `0x${string}`,
    BorrowController:
      '0x3989557B16fc8dB74CC8Ab0c5981b2396555d3C2' as `0x${string}`,
    CouponManager:
      '0x8bbcA766D175aDbffB073832262990df1c5ef748' as `0x${string}`,
    CouponMarketRouter:
      '0xF7bb8649006E00E849e63f5cbF0887B0E0Dd9d97' as `0x${string}`,
    CouponOracle: '0xF8e9ab02b057978c29Ca57c7E086D46983764A13' as `0x${string}`,
    CouponWrapper:
      '0xc5577988Cc8A49ecF6A48c8e84717E481E3bF57b' as `0x${string}`,
    DepositController:
      '0xE829fDe841c2a4b8dF34D0ebA146c06393D7F322' as `0x${string}`,
    EthSubstituteMinter:
      '0xeA424D3C88aF908769B3292bd88c60E5652b308E' as `0x${string}`,
    LoanPositionManager:
      '0x03d65411684ae7B5440E11a6063881a774C733dF' as `0x${string}`,
    SimpleBondController:
      '0x2EA069EB48De599BBd490a07A2Ea9BD9730F7475' as `0x${string}`,
    Wrapped1155Factory:
      '0xfcBE16BfD991E4949244E59d9b524e6964b8BB75' as `0x${string}`,
  },
}
