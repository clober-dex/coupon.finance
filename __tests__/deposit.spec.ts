import { zeroAddress } from 'viem'

import {
  calculateDepositApy,
  calculateTotalDeposit,
  Market,
} from '../model/market'
import {
  getCurrentEpochIndex,
  getEpochEndTimestamp,
  getEpochStartTimestamp,
} from '../utils/epoch'

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

  it('check date util functions', () => {
    expect(getCurrentEpochIndex(1692949188)).toEqual(107n)
    expect(getCurrentEpochIndex(1696948730)).toEqual(107n)
    expect(getCurrentEpochIndex(1706948730)).toEqual(108n)
    expect(getCurrentEpochIndex(1726948730)).toEqual(109n)

    expect(getEpochStartTimestamp(107n)).toEqual(1672531200)
    expect(getEpochStartTimestamp(108n)).toEqual(1688169600)
    expect(getEpochStartTimestamp(109n)).toEqual(1704067200)
    expect(getEpochStartTimestamp(110n)).toEqual(1719792000)

    expect(getEpochEndTimestamp(107n)).toEqual(1688169599)
    expect(getEpochEndTimestamp(108n)).toEqual(1704067199)
    expect(getEpochEndTimestamp(109n)).toEqual(1719791999)
    expect(getEpochEndTimestamp(110n)).toEqual(1735689599)
  })

  it('check deposit apr', () => {
    const markets = [
      new Market(
        zeroAddress,
        zeroAddress,
        0n,
        10n ** 9n,
        107n,
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
        [
          {
            price: 10n ** 17n, // 10%,
            rawAmount: ONE_ETH * 1000000n, // 1000000 ETH
            isBid: true,
          },
        ],
        [],
      ),
      new Market(
        zeroAddress,
        zeroAddress,
        0n,
        10n ** 9n,
        108n,
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
        [
          {
            price: 10n ** 17n, // 10%,
            rawAmount: ONE_ETH * 1000000n, // 1000000 ETH
            isBid: true,
          },
        ],
        [],
      ),
    ]
    const initialDeposit = 10n ** 18n * 100n
    const apr = calculateDepositApy(
      {
        decimals: 18,
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'ETH',
        name: '',
      },
      markets,
      initialDeposit,
      getEpochStartTimestamp(107n),
    )
    expect(apr).toBeCloseTo(100 / (1 - 0.2) / 100)
  })
})
