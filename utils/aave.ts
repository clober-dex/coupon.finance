import BigNumber from 'bignumber.js'

type BigNumberValue = string | number | BigNumber

const BigNumberZD = BigNumber.clone({
  DECIMAL_PLACES: 0,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
})

function valueToZDBigNumber(amount: BigNumberValue): BigNumber {
  return new BigNumberZD(amount)
}

const SECONDS_PER_YEAR = valueToBigNumber('31536000')
const RAY_DECIMALS = 27
const RAY = valueToZDBigNumber(10).pow(27)
const HALF_RAY = RAY.dividedBy(2)
const bn10 = new BigNumber(10)
const bn10PowLookup: { [key: number]: BigNumber } = {}

function rayMul(a: BigNumberValue, b: BigNumberValue): BigNumber {
  return HALF_RAY.plus(valueToZDBigNumber(a).multipliedBy(b)).div(RAY)
}

function valueToBigNumber(amount: BigNumberValue): BigNumber {
  return new BigNumber(amount)
}

function pow10(decimals: number): BigNumber {
  if (!bn10PowLookup[decimals]) {
    bn10PowLookup[decimals] = bn10.pow(decimals)
  }
  return bn10PowLookup[decimals]
}

function normalizeBN(n: BigNumberValue, decimals: number): BigNumber {
  return valueToBigNumber(n).dividedBy(pow10(decimals))
}

function rayPow(a: BigNumberValue, p: BigNumberValue): BigNumber {
  let x = valueToZDBigNumber(a)
  let n = valueToZDBigNumber(p)
  let z = !n.modulo(2).eq(0) ? x : valueToZDBigNumber(RAY)

  for (n = n.div(2); !n.eq(0); n = n.div(2)) {
    x = rayMul(x, x)

    if (!n.modulo(2).eq(0)) {
      z = rayMul(z, x)
    }
  }
  return z
}

export const convertVariableBorrowRateToAPY = (rate: BigNumberValue) => {
  const variableBorrowAPY = rayPow(
    valueToZDBigNumber(rate).dividedBy(SECONDS_PER_YEAR).plus(RAY),
    SECONDS_PER_YEAR,
  ).minus(RAY)
  return normalizeBN(variableBorrowAPY, RAY_DECIMALS).times(100).toNumber()
}
