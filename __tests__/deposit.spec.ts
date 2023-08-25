import { zeroAddress } from 'viem'

import { calculateTotalDeposit, Market } from '../model/market'

const ONE_ETH = 10n ** 9n
const market = new Market(
  zeroAddress,
  zeroAddress,
  0n,
  10n ** 9n,
  1n,
  0n,
  0n,
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
  [],
  [],
)
const price = 10n ** 17n // 10%

const expectEqualWithin = (
  amount: bigint,
  expected: bigint,
  threshold: bigint,
) => {
  expect(
    amount > expected ? amount - expected : expected - amount,
  ).toBeLessThan(threshold)
}

describe('Deposit controller', () => {
  it('check deposit to 1 market', () => {
    const depositedAmount = calculateTotalDeposit(
      [
        Market.from(
          market,
          [
            {
              price,
              rawAmount: ONE_ETH * 1000000n, // 1000000 ETH
              isBid: true,
            },
          ],
          [],
        ),
      ],
      10n ** 18n * 100n,
    )
    expect(depositedAmount).toEqual(111111111111000000000n)

    const depositedAmount2 = calculateTotalDeposit(
      [
        Market.from(
          market,
          [
            {
              price,
              rawAmount: ONE_ETH * 10n, // 10 ETH
              isBid: true,
            },
          ],
          [],
        ),
      ],
      10n ** 18n * 100n,
    )
    expect(depositedAmount2).toEqual(110000000000000000000n)

    const depositedAmount3 = calculateTotalDeposit(
      [
        Market.from(
          market,
          [
            {
              price: 10n ** 17n, // 10%,
              rawAmount: ONE_ETH * 10n, // 10 ETH
              isBid: true,
            },
            {
              price: 10n ** 16n, // 1%,
              rawAmount: ONE_ETH * 100000n, // 100000 ETH
              isBid: true,
            },
          ],
          [],
        ),
      ],
      10n ** 18n * 100n,
    )
    expect(depositedAmount3).toEqual(110101010101000000000n)
  })

  it('check deposit to 2 markets', () => {
    const depositedAmount = calculateTotalDeposit(
      [
        Market.from(
          market,
          [
            {
              price,
              rawAmount: ONE_ETH * 1000000n, // 1000000 ETH
              isBid: true,
            },
          ],
          [],
        ),
        Market.from(
          market,
          [
            {
              price,
              rawAmount: ONE_ETH * 1000000n, // 1000000 ETH
              isBid: true,
            },
          ],
          [],
        ),
      ],
      10n ** 18n * 100n,
    )

    expectEqualWithin(
      depositedAmount,
      (100n * 10n ** 18n * 100n) / (100n - 20n),
      10n ** 10n,
    )

    const depositedAmount2 = calculateTotalDeposit(
      [
        Market.from(
          market,
          [
            {
              price: 10n ** 17n, // 10%,
              rawAmount: ONE_ETH * 1000000n, // 1000000 ETH
              isBid: true,
            },
          ],
          [],
        ),
        Market.from(
          market,
          [
            {
              price: 10n ** 16n, // 1%,
              rawAmount: ONE_ETH * 1000000n, // 1000000 ETH
              isBid: true,
            },
          ],
          [],
        ),
      ],
      10n ** 18n * 100n,
    )

    expectEqualWithin(
      depositedAmount2,
      (100n * 10n ** 18n * 100n) / (100n - 11n),
      10n ** 13n,
    )
  })
})
