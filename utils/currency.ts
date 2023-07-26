export type Currency = {
  address: string
  name: string
  symbol: string
  decimals: number
  logo: string
}

export const CURRENCY_MAP: {
  [key: string]: Currency
} = {
  USDC: {
    address: '0xA8CE8aee21bC2A48a5EF670afCc9274C7bbbC035',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    logo: '/assets/icons/icon-usdc.svg',
  },
  ETH: {
    address: '0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9',
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    logo: '/assets/icons/icon-eth.svg',
  },
  ARB: {
    address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    name: 'Arbitrum',
    symbol: 'ARB',
    decimals: 18,
    logo: '/assets/icons/icon-arb.svg',
  },
}
