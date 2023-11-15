import { BondPosition } from '../../model/bond-position'

export const dummyBondPosition: BondPosition = {
  tokenId: 51n,
  substitute: {
    address: '0xed720edc99b7e05101a9bc093fbc7a3f76a4212d',
    name: 'Wrapped Aave Dai Stablecoin',
    symbol: 'WaDAI',
    decimals: 18,
  },
  underlying: {
    address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
  },
  interest: 1110872530000000000n,
  amount: 11110428175990000000n,
  fromEpoch: {
    id: 107,
    startTimestamp: 1688169600,
    endTimestamp: 1704067199,
  },
  toEpoch: {
    id: 107,
    startTimestamp: 1688169600,
    endTimestamp: 1704067199,
  },
  createdAt: 1693325759,
  isPending: false,
}
