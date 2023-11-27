import { Market } from '../../model/market'

export const dummyMarket: Market = new Market(
  '0x20079b5959A4C865D935D3AbC6141978cfac525D',
  '0x0333438Faa8A7A94cd2eE0Ac0C1087F19a77B5Df',
  945108708427390473832552046786734932245404340286835n,
  400n,
  1000000000n,
  646,
  1698796800,
  1701388799,
  {
    address: '0xAb6c37355D6C06fcF73Ab0E049d9Cf922f297573',
    name: 'Wrapped Aave Wrapped Ether',
    symbol: 'WaWETH',
    decimals: 18,
  },
  {
    address: '0xf322C51564C4caD637495b13369BC5475d4467A9',
    name: 'WaWETH Bond Coupon (646)',
    symbol: 'WaWETH-CP646',
    decimals: 18,
  },
  1n,
  1n,
  [
    { price: 5997984335510763n, rawAmount: 109487282n, isBid: true },
    { price: 3997328781734591n, rawAmount: 159992378n, isBid: true },
    { price: 809308419746665n, rawAmount: 33000000n, isBid: true },
  ],
  [{ price: 6100769888025821n, rawAmount: 89322843n, isBid: false }],
)
