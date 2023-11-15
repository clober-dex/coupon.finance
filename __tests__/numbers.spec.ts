import { formatUnits } from '../utils/numbers'

describe('formatUnits', () => {
  it('check stablecoin formatUnits', () => {
    const PRICE_1 = { value: 10n ** 8n, decimals: 8 }
    const PRICE_1_02 = { value: 102n * 10n ** 6n, decimals: 8 }
    const PRICE_0_98 = { value: 98n * 10n ** 6n, decimals: 8 }

    expect(formatUnits(123456789123456789123456789n, 18)).toEqual(
      '123456789.123456789123456789',
    )
    expect(formatUnits(123456789123456789123456789n, 18, PRICE_1)).toEqual(
      '123,456,789.12',
    )
    expect(formatUnits(123456789123456789123456789n, 18, PRICE_1_02)).toEqual(
      '123,456,789.12',
    )
    expect(formatUnits(123456789123456789123456789n, 18, PRICE_0_98)).toEqual(
      '123,456,789.12',
    )

    expect(formatUnits(1n, 18)).toEqual('0.000000000000000001')
    expect(formatUnits(1n, 18, PRICE_1)).toEqual('0.000000000000000001')
    expect(formatUnits(1n, 18, PRICE_1_02)).toEqual('0.000000000000000001')
    expect(formatUnits(1n, 18, PRICE_0_98)).toEqual('0.000000000000000001')

    expect(formatUnits(123456123456n, 6)).toEqual('123456.123456')
    expect(formatUnits(123456123456n, 6, PRICE_1)).toEqual('123,456.12')
    expect(formatUnits(123456123456n, 6, PRICE_1_02)).toEqual('123,456.12')
    expect(formatUnits(123456123456n, 6, PRICE_0_98)).toEqual('123,456.12')

    expect(formatUnits(1n, 6)).toEqual('0.000001')
    expect(formatUnits(1n, 6, PRICE_1)).toEqual('0.000001')
    expect(formatUnits(1n, 6, PRICE_1_02)).toEqual('0.000001')
    expect(formatUnits(1n, 6, PRICE_0_98)).toEqual('0.000001')
  })

  it('check ethereum formatUnits', () => {
    const PRICE_3_2 = { value: 3n * 10n ** (8n + 2n), decimals: 8 } // 300
    const PRICE_3_3 = { value: 3n * 10n ** (8n + 3n), decimals: 8 } // 3000
    const PRICE_3_4 = { value: 3n * 10n ** (8n + 4n), decimals: 8 } // 30000
    const PRICE_3_5 = { value: 3n * 10n ** (8n + 5n), decimals: 8 } // 300000
    const PRICE_3_6 = { value: 3n * 10n ** (8n + 6n), decimals: 8 } // 3000000
    const PRICE_3_7 = { value: 3n * 10n ** (8n + 7n), decimals: 8 } // 30000000
    const PRICE_3_8 = { value: 3n * 10n ** (8n + 8n), decimals: 8 } // 300000000
    const PRICE_3_9 = { value: 3n * 10n ** (8n + 9n), decimals: 8 } // 3000000000

    expect(formatUnits(123456789123456789n, 18)).toEqual('0.123456789123456789')
    expect(formatUnits(123456789123456789n, 18, PRICE_3_2)).toEqual('0.1235')
    expect(formatUnits(123456789123456789n, 18, PRICE_3_3)).toEqual('0.1235')
    expect(formatUnits(123456789123456789n, 18, PRICE_3_4)).toEqual('0.123457')
    expect(formatUnits(123456789123456789n, 18, PRICE_3_5)).toEqual('0.123457')

    expect(formatUnits(123456789n, 18)).toEqual('0.000000000123456789')
    expect(formatUnits(123456789n, 18, PRICE_3_2)).toEqual(
      '0.000000000123456789',
    )
    expect(formatUnits(123456789n, 18, PRICE_3_3)).toEqual(
      '0.000000000123456789',
    )
    expect(formatUnits(123456789n, 18, PRICE_3_4)).toEqual(
      '0.000000000123456789',
    )
    expect(formatUnits(123456789n, 18, PRICE_3_5)).toEqual(
      '0.000000000123456789',
    )
    expect(formatUnits(123456789n, 18, PRICE_3_6)).toEqual(
      '0.000000000123456789',
    )
    expect(formatUnits(123456789n, 18, PRICE_3_7)).toEqual(
      '0.000000000123456789',
    )
    expect(formatUnits(123456789n, 18, PRICE_3_8)).toEqual('0.0000000001')
    expect(formatUnits(123456789n, 18, PRICE_3_9)).toEqual('0.0000000001')
  })

  it('check memecoin formatUnits', () => {
    const PRICE_0_1 = { value: 10n ** (8n - 1n), decimals: 8 } // 0.1
    const PRICE_0_01 = { value: 10n ** (8n - 2n), decimals: 8 } // 0.01
    const PRICE_0_001 = { value: 10n ** (8n - 3n), decimals: 8 } // 0.001
    expect(formatUnits(123456789123456789123456789n, 18)).toEqual(
      '123456789.123456789123456789',
    )
    expect(formatUnits(123456789123456789123456789n, 18, PRICE_0_1)).toEqual(
      '123,456,789',
    )
    expect(formatUnits(123456789123456789123456789n, 18, PRICE_0_01)).toEqual(
      '123,456,789',
    )
    expect(formatUnits(123456789123456789123456789n, 18, PRICE_0_001)).toEqual(
      '123,456,789',
    )
  })
})
