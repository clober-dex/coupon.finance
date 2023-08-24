import { AddressZero } from '@ethersproject/constants'
import BigNumber from 'bignumber.js'

import { calculateTotalDeposit, Market } from '../model/market'
import { BigDecimal } from '../utils/big-decimal'

const ONE_ETH = 10n ** 9n
const market = new Market(
  AddressZero,
  AddressZero,
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
})
