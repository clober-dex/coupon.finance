import { AddressZero } from '@ethersproject/constants'

import { Market } from '../api/market'
import { calculateDepositedAmount } from '../model/market'

describe('Deposit controller', () => {
  it('check deposit', async () => {
    const price = 10n ** 17n // 10%
    const dummyMarket = new Market(
      AddressZero,
      AddressZero,
      10000000000n,
      1001000000000000000n,
      0n,
      0n,
      0n,
      10n ** 9n,
      {
        decimals: 18,
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'ETH',
        name: '',
      },
      {
        decimals: 18,
        address: '0x0000000000000000000000000000000000000001',
        symbol: 'ETH',
        name: '',
      },
      1n,
      1n,
      [
        {
          price,
          rawAmount: 10n ** 9n * 10n, // 10 ETH (~$16000)
          isBid: true,
        },
        {
          price,
          rawAmount: 10n ** 9n * 1n, // 1 ETH (~$1600)
          isBid: true,
        },
        {
          price,
          rawAmount: 10n ** 8n, // 0.1 ETH (~$160)
          isBid: true,
        },
        {
          price,
          rawAmount: 10n ** 7n, // 0.01 ETH (~$16)
          isBid: true,
        },
        {
          price,
          rawAmount: 10n ** 6n, // 0.001 ETH (~$1.6)
          isBid: true,
        },
        {
          price,
          rawAmount: 10n ** 5n, // 0.001 ETH (~$0.16)
          isBid: true,
        },
        {
          price,
          rawAmount: 10n ** 4n, // 0.001 ETH (~$0.016)
          isBid: true,
        },
        {
          price,
          rawAmount: 10n ** 3n, // 0.001 ETH (~$0.0016)
          isBid: true,
        },
        {
          price,
          rawAmount: 10n ** 2n, // 0.001 ETH (~$0.00016)
          isBid: true,
        },
        {
          price,
          rawAmount: 10n ** 1n, // 0.001 ETH (~$0.000016)
          isBid: true,
        },
      ],
      [],
    )
    const depositedAmount = calculateDepositedAmount(
      dummyMarket,
      100n * 10n ** 18n,
      1600,
      1,
    )
    expect(depositedAmount).toEqual(111111100000000000000n)
  })
})
