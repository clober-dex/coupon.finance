import { zeroAddress } from 'viem'

import {
  calculateDepositApy,
  calculateTotalDeposit,
  Market,
} from '../model/market'
import { getCurrentEpochIndex } from '../utils/epoch'

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

    expect(Number(depositedAmount) / 10 ** 18).toBeCloseTo(125)

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

    expect(Number(depositedAmount2) / 10 ** 18).toBeCloseTo(112.3595)
  })

  it('check date util functions', () => {
    expect(getCurrentEpochIndex(1)).toEqual(0n)
    expect(getCurrentEpochIndex(1688169601)).toEqual(107n)
    expect(getCurrentEpochIndex(1704067198)).toEqual(107n)
    expect(getCurrentEpochIndex(1704067201)).toEqual(108n)
    expect(getCurrentEpochIndex(1719792001)).toEqual(109n)
    expect(getCurrentEpochIndex(1735689601)).toEqual(110n)
  })

  it('check deposit apy', () => {
    const markets = [
      new Market(
        zeroAddress,
        zeroAddress,
        0n,
        10n ** 9n,
        107n,
        1688169600n,
        1704067199n,
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
        1704067200n,
        1719791999n,
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
    const { apy, proceeds } = calculateDepositApy(
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
    expect(apy).toBeCloseTo(100 / (1 - 0.2) / 100)
    expect(Number(proceeds) / 10 ** 18).toBeCloseTo(25)
  })
})
