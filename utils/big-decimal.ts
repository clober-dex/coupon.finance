import BigNumber from 'bignumber.js'

export class BigDecimal {
  decimals: number
  value: BigNumber // Decimal value, shown to users

  constructor(decimals: number, value: BigNumber.Value) {
    this.decimals = decimals
    this.value = new BigNumber(value)
  }

  static fromDecimalValue(
    decimals: number,
    value: BigNumber.Value,
  ): BigDecimal {
    const bigNumber = new BigNumber(value)
    if (bigNumber.isNaN()) {
      return new BigDecimal(decimals, 0)
    }
    return new BigDecimal(decimals, value)
  }

  static fromIntegerValue(
    decimals: number,
    value: BigNumber.Value,
  ): BigDecimal {
    const bigNumber = new BigNumber(value)
    if (bigNumber.isNaN()) {
      return new BigDecimal(decimals, 0)
    }

    return new BigDecimal(
      decimals,
      bigNumber.div(new BigNumber(10).pow(decimals)),
    )
  }

  plus(bd: BigDecimal): BigDecimal {
    return new BigDecimal(this.decimals, this.value.plus(bd.value))
  }

  minus(bd: BigDecimal): BigDecimal {
    return new BigDecimal(this.decimals, this.value.minus(bd.value))
  }

  times(bd: BigDecimal) {
    return new BigDecimal(this.decimals, this.value.times(bd.value))
  }

  div(bd: BigDecimal) {
    return new BigDecimal(this.decimals, this.value.div(bd.value))
  }

  abs(): BigDecimal {
    return new BigDecimal(this.decimals, this.value.abs())
  }

  toDecimalString(decimalPlaces?: number): string {
    return this.value.toFixed(decimalPlaces ?? this.decimals)
  }

  toFormat(decimalPlaces?: number): string {
    return this.value.toFormat(decimalPlaces ?? this.decimals)
  }

  toIntegerString(): string {
    return this.value
      .multipliedBy(new BigNumber(10).pow(this.decimals))
      .toFixed(0)
  }
}

export const ZERO = new BigDecimal(18, 0)
