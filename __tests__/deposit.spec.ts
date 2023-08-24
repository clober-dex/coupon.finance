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
          // 10 ETH (~$16000) + 1 ETH (~$1600) + 0.1 ETH (~$160) + 0.01 ETH (~$16) + 0.001 ETH (~$1.6) + 0.0001 ETH (~$0.16) + 0.00001 ETH (~$0.016) + 0.000001 ETH (~$0.0016) + 0.0000001 ETH (~$0.00016) + 0.00000001 ETH (~$0.000016)
          rawAmount:
            10n ** 9n * 10n +
            10n ** 9n * 1n +
            10n ** 8n +
            10n ** 7n +
            10n ** 6n +
            10n ** 5n +
            10n ** 4n +
            10n ** 3n +
            10n ** 2n +
            10n ** 1n,
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
