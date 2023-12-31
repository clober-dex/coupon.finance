import { zeroAddress } from 'viem'

import {
  calculateDepositInfos,
  calculateTotalDeposit,
  Market,
} from '../model/market'

const ONE_ETH = 1000000000n
const market = new Market(
  zeroAddress,
  zeroAddress,
  0n,
  0n,
  10n ** 9n,
  1,
  0,
  0,
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
const price = 100000000000000000n // 10%

describe('Deposit controller', () => {
  it('check deposit to 1 market', () => {
    const { totalDeposit: depositedAmount } = calculateTotalDeposit(
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

    const { totalDeposit: depositedAmount2 } = calculateTotalDeposit(
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

    const { totalDeposit: depositedAmount3 } = calculateTotalDeposit(
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
    const { totalDeposit: depositedAmount } = calculateTotalDeposit(
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

    expect(Number(depositedAmount) / 10 ** 18).toBeCloseTo(125)

    const { totalDeposit: depositedAmount2 } = calculateTotalDeposit(
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

    expect(Number(depositedAmount2) / 10 ** 18).toBeCloseTo(112.3595)
  })

  it('check deposit apy', () => {
    const markets = [
      new Market(
        zeroAddress,
        zeroAddress,
        0n,
        0n,
        10n ** 9n,
        107,
        1688169600,
        1704067199,
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
        0n,
        10n ** 9n,
        108,
        1704067200,
        1719791999,
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
    const { apy, proceeds } = calculateDepositInfos(
      {
        decimals: 18,
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'ETH',
        name: '',
      },
      markets,
      initialDeposit,
      1688169600,
    )
    expect(apy).toBeCloseTo(100 / (1 - 0.2) - 100, 0.01)
    expect(Number(proceeds) / 10 ** 18).toBeCloseTo(25)
  })
})
