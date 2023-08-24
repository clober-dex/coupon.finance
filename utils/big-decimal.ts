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

  plus(dn: BigDecimal): BigDecimal {
    return new BigDecimal(this.decimals, this.value.plus(dn.value))
  }

  minus(dn: BigDecimal): BigDecimal {
    return new BigDecimal(this.decimals, this.value.minus(dn.value))
  }

  times(value: BigNumber.Value) {
    return new BigDecimal(this.decimals, this.value.times(value))
  }

  toDecimalString(): string {
    return this.value.toFixed(this.decimals)
  }

  toIntegerString(): string {
    return this.value
      .multipliedBy(new BigNumber(10).pow(this.decimals))
      .toFixed(0)
  }
}
