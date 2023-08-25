import { AddressZero } from '@ethersproject/constants'
import BigNumber from 'bignumber.js'

import {
  calculateDepositApr,
  calculateTotalDeposit,
  Market,
} from '../model/market'
import { BigDecimal } from '../utils/big-decimal'
import {
  getCurrentEpochIndex,
  getEpochEndTimestamp,
  getEpochStartTimestamp,
} from '../utils/date'

const ONE_ETH = 10n ** 9n
const market = new Market(
  AddressZero,
  AddressZero,
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
  amount: BigDecimal,
  expected: BigDecimal,
  threshold: BigDecimal,
) => {
  expect(BigInt(amount.minus(expected).abs().toIntegerString())).toBeLessThan(
    BigInt(threshold.toIntegerString()),
  )
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
      BigDecimal.fromIntegerValue(18, new BigNumber(10).pow(18).times(100)),
    )
    expect(depositedAmount.toIntegerString()).toEqual('111111111111000000000')

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
      BigDecimal.fromIntegerValue(18, new BigNumber(10).pow(18).times(100)),
    )
    expect(depositedAmount2.toIntegerString()).toEqual('110000000000000000000')

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
      BigDecimal.fromIntegerValue(18, new BigNumber(10).pow(18).times(100)),
    )
    expect(depositedAmount3.toIntegerString()).toEqual('110101010101000000000')
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
      BigDecimal.fromIntegerValue(18, new BigNumber(10).pow(18).times(100)),
    )

    expectEqualWithin(
      depositedAmount,
      BigDecimal.fromDecimalValue(18, new BigNumber(100 / (1 - 0.2))),
      BigDecimal.fromDecimalValue(18, new BigNumber(0.00000001)),
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
      BigDecimal.fromIntegerValue(18, new BigNumber(10).pow(18).times(100)),
    )

    expectEqualWithin(
      depositedAmount2,
      BigDecimal.fromDecimalValue(18, new BigNumber(100 / (1 - 0.11))),
      BigDecimal.fromDecimalValue(18, new BigNumber(0.00001)),
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
        AddressZero,
        AddressZero,
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
        AddressZero,
        AddressZero,
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
      new Market(
        AddressZero,
        AddressZero,
        0n,
        10n ** 9n,
        109n,
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
    const initialDeposit = BigDecimal.fromIntegerValue(
      18,
      new BigNumber(10).pow(18).times(100),
    )
    const apr = calculateDepositApr(
      {
        decimals: 18,
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'ETH',
        name: '',
      },
      markets,
      initialDeposit,
      getEpochStartTimestamp(107n),
      108n,
    )
    expect(apr).toBeCloseTo(100 / (1 - 0.2) / 100)
  })
})
