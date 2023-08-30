import { formatUnits } from '../utils/numbers'

describe('formatUnits', () => {
  it('check stablecoin formatUnits', () => {
    expect(formatUnits(123456789123456789123456789n, 18)).toEqual(
      '123456789.123456789123456789',
    )
    expect(formatUnits(123456789123456789123456789n, 18, 1)).toEqual(
      '123456789.12',
    )
    expect(formatUnits(123456789123456789123456789n, 18, 1.02)).toEqual(
      '123456789.12',
    )
    expect(formatUnits(123456789123456789123456789n, 18, 0.98)).toEqual(
      '123456789.12',
    )

    expect(formatUnits(1n, 18)).toEqual('0.000000000000000001')
    expect(formatUnits(1n, 18, 1)).toEqual('0.000000000000000001')
    expect(formatUnits(1n, 18, 1.02)).toEqual('0.000000000000000001')
    expect(formatUnits(1n, 18, 0.98)).toEqual('0.000000000000000001')

    expect(formatUnits(123456123456n, 6)).toEqual('123456.123456')
    expect(formatUnits(123456123456n, 6, 1)).toEqual('123456.12')
    expect(formatUnits(123456123456n, 6, 1.02)).toEqual('123456.12')
    expect(formatUnits(123456123456n, 6, 0.98)).toEqual('123456.12')

    expect(formatUnits(1n, 6)).toEqual('0.000001')
    expect(formatUnits(1n, 6, 1)).toEqual('0.000001')
    expect(formatUnits(1n, 6, 1.02)).toEqual('0.000001')
    expect(formatUnits(1n, 6, 0.98)).toEqual('0.000001')
  })

  it('check ethereum formatUnits', () => {
    expect(formatUnits(123456789123456789n, 18)).toEqual('0.123456789123456789')
    expect(formatUnits(123456789123456789n, 18, 300)).toEqual('0.1235')
    expect(formatUnits(123456789123456789n, 18, 3000)).toEqual('0.1235')
    expect(formatUnits(123456789123456789n, 18, 30000)).toEqual('0.123457')
    expect(formatUnits(123456789123456789n, 18, 300000)).toEqual('0.123457')

    expect(formatUnits(123456789n, 18)).toEqual('0.000000000123456789')
    expect(formatUnits(123456789n, 18, 300)).toEqual('0.000000000123456789')
    expect(formatUnits(123456789n, 18, 3000)).toEqual('0.000000000123456789')
    expect(formatUnits(123456789n, 18, 30000)).toEqual('0.000000000123456789')
    expect(formatUnits(123456789n, 18, 300000)).toEqual('0.000000000123456789')
    expect(formatUnits(123456789n, 18, 3000000)).toEqual('0.000000000123456789')
    expect(formatUnits(123456789n, 18, 30000000)).toEqual(
      '0.000000000123456789',
    )
    expect(formatUnits(123456789n, 18, 300000000)).toEqual('0.0000000001')
    expect(formatUnits(123456789n, 18, 3000000000)).toEqual('0.0000000001')
  })

  it('check memecoin formatUnits', () => {
    expect(formatUnits(123456789123456789123456789n, 18)).toEqual(
      '123456789.123456789123456789',
    )
    expect(formatUnits(123456789123456789123456789n, 18, 0.1)).toEqual(
      '123456789',
    )
    expect(formatUnits(123456789123456789123456789n, 18, 0.01)).toEqual(
      '123456789',
    )
    expect(formatUnits(123456789123456789123456789n, 18, 0.001)).toEqual(
      '123456789',
    )
  })
})
