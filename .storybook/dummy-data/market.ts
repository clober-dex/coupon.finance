import { Market } from '../../model/market'

export const dummyMarket: Market = Market.fromDto({
  address: '0x20079b5959A4C865D935D3AbC6141978cfac525D',
  orderToken: '0x0333438Faa8A7A94cd2eE0Ac0C1087F19a77B5Df',
  couponId: '945108708427390473832552046786734932245404340286835',
  takerFee: '400',
  quoteUnit: '1000000000',
  epoch: {
    id: '646',
    startTimestamp: '1698796800',
    endTimestamp: '1701388799',
  },
  quoteToken: {
    address: '0xAb6c37355D6C06fcF73Ab0E049d9Cf922f297573',
    name: 'Wrapped Aave Wrapped Ether',
    symbol: 'WaWETH',
    decimals: 18,
  },
  baseToken: {
    address: '0xf322C51564C4caD637495b13369BC5475d4467A9',
    name: 'WaWETH Bond Coupon (646)',
    symbol: 'WaWETH-CP646',
    decimals: 18,
  },
  depths: [
    { price: '5997984335510763', rawAmount: '109487282', isBid: true },
    { price: '3997328781734591', rawAmount: '159992378', isBid: true },
    { price: '809308419746665', rawAmount: '33000000', isBid: true },
    { price: '6100769888025821', rawAmount: '89322843', isBid: false },
  ],
})
