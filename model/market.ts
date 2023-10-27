import { isAddressEqual } from 'viem'

import { MarketDto } from '../apis/market'
import { calculateApy } from '../utils/apy'
import { max, min } from '../utils/bigint'
import { formatDate } from '../utils/date'

import { Currency } from './currency'

type Depth = {
  price: bigint
  rawAmount: bigint
  isBid: boolean
}

export class Market {
  readonly FEE_PRECISION = 10n ** 6n
  readonly PRICE_PRECISION = 10n ** 18n

  address: string
  orderToken: string
  takerFee: bigint
  quoteUnit: bigint
  epoch: number
  startTimestamp: number
  endTimestamp: number
  quoteToken: Currency
  baseToken: Currency
  quotePrecisionComplement: bigint
  basePrecisionComplement: bigint
  bids: Depth[]
  asks: Depth[]

  constructor(
    address: string,
    orderToken: string,
    takerFee: bigint,
    quoteUnit: bigint,
    epoch: number,
    startTimestamp: number,
    endTimestamp: number,
    quoteToken: Currency,
    baseToken: Currency,
    quotePrecisionComplement: bigint,
    basePrecisionComplement: bigint,
    bids: Depth[],
    asks: Depth[],
  ) {
    this.address = address
    this.orderToken = orderToken
    this.takerFee = takerFee
    this.quoteUnit = quoteUnit
    this.epoch = epoch
    this.startTimestamp = startTimestamp
    this.endTimestamp = endTimestamp
    this.quoteToken = quoteToken
    this.baseToken = baseToken
    this.quotePrecisionComplement = quotePrecisionComplement
    this.basePrecisionComplement = basePrecisionComplement
    this.bids = bids
    this.asks = asks
  }

  static from(market: Market, bids: Depth[], asks: Depth[]): Market {
    return new Market(
      market.address,
      market.orderToken,
      market.takerFee,
      market.quoteUnit,
      market.epoch,
      market.startTimestamp,
      market.endTimestamp,
      market.quoteToken,
      market.baseToken,
      market.quotePrecisionComplement,
      market.basePrecisionComplement,
      bids,
      asks,
    )
  }

  static fromDto(dto: MarketDto): Market {
    return new Market(
      dto.address,
      dto.orderToken,
      BigInt(dto.takerFee),
      BigInt(dto.quoteUnit),
      Number(dto.epoch.id),
      Number(dto.epoch.startTimestamp),
      Number(dto.epoch.endTimestamp),
      dto.quoteToken,
      dto.baseToken,
      10n ** (18n - BigInt(dto.quoteToken.decimals)),
      10n ** (18n - BigInt(dto.baseToken.decimals)),
      dto.depths
        .filter((depth) => depth.isBid)
        .sort((a, b) => {
          return Number(b.price) - Number(a.price)
        })
        .map((depth) => ({
          price: BigInt(depth.price),
          rawAmount: BigInt(depth.rawAmount),
          isBid: depth.isBid,
        })),
      dto.depths
        .filter((depth) => !depth.isBid)
        .sort((a, b) => {
          return Number(a.price) - Number(b.price)
        })
        .map((depth) => ({
          price: BigInt(depth.price),
          rawAmount: BigInt(depth.rawAmount),
          isBid: depth.isBid,
        })),
    )
  }

  private divide(x: bigint, y: bigint, roundUp: boolean): bigint {
    if (roundUp) {
      if (x === 0n) {
        return 0n
      } else {
        return (x - 1n) / y + 1n
      }
    } else {
      return x / y
    }
  }

  private quoteToRaw(amount: bigint, roundUp: boolean): bigint {
    return this.divide(amount, this.quoteUnit, roundUp)
  }

  private rawToQuote(rawAmount: bigint): bigint {
    return rawAmount * this.quoteUnit
  }

  private baseToRaw(amount: bigint, price: bigint, roundUp: boolean): bigint {
    return this.divide(
      amount * price * this.basePrecisionComplement,
      this.PRICE_PRECISION * this.quotePrecisionComplement * this.quoteUnit,
      roundUp,
    )
  }

  private rawToBase(
    rawAmount: bigint,
    price: bigint,
    roundUp: boolean,
  ): bigint {
    return this.divide(
      this.rawToQuote(rawAmount) *
        this.PRICE_PRECISION *
        this.quotePrecisionComplement,
      price * this.basePrecisionComplement,
      roundUp,
    )
  }

  private calculateTakerFeeAmount(
    takeAmount: bigint,
    roundUp: boolean,
  ): bigint {
    return this.divide(takeAmount * this.takerFee, this.FEE_PRECISION, roundUp)
  }

  private calculateTakeAmountBeforeFees(amountAfterFees: bigint): bigint {
    return this.divide(
      amountAfterFees * this.FEE_PRECISION,
      this.FEE_PRECISION - this.takerFee,
      true,
    )
  }

  clone(): Market {
    return Object.create(
      Object.getPrototypeOf(this),
      Object.getOwnPropertyDescriptors(this),
    )
  }

  spend(
    tokenIn: `0x${string}`,
    amountIn: bigint,
  ): {
    market: Market
    amountOut: bigint
  } {
    const asks = [...this.asks.map((depth) => ({ ...depth }))]
    const bids = [...this.bids.map((depth) => ({ ...depth }))]
    let amountOut: bigint = 0n
    if (isAddressEqual(tokenIn, this.quoteToken.address as `0x${string}`)) {
      while (asks.length > 0) {
        const { price, rawAmount } = asks[0]
        const amountInRaw = this.quoteToRaw(amountIn, false)
        if (amountInRaw >= rawAmount) {
          amountIn -= this.rawToQuote(rawAmount)
          amountOut += this.rawToBase(rawAmount, price, false)
          asks.shift()
        } else {
          amountOut += this.rawToBase(amountInRaw, price, false)
          asks[0].rawAmount = rawAmount - amountInRaw
          break
        }
      }
    } else {
      while (bids.length > 0) {
        const { price, rawAmount } = bids[0]
        const amountInRaw = this.baseToRaw(amountIn, price, false)
        if (amountInRaw >= rawAmount) {
          amountIn -= this.rawToBase(rawAmount, price, true)
          amountOut += this.rawToQuote(rawAmount)
          bids.shift()
        } else {
          amountOut += this.rawToQuote(amountInRaw)
          bids[0].rawAmount = rawAmount - amountInRaw
          break
        }
      }
    }
    amountOut -= this.calculateTakerFeeAmount(amountOut, true)
    return {
      amountOut,
      market: Market.from(this, bids, asks),
    }
  }

  take(
    tokenIn: string,
    amountOut: bigint,
  ): {
    market: Market
    amountIn: bigint
  } {
    amountOut = this.calculateTakeAmountBeforeFees(amountOut)
    const asks = [...this.asks.map((depth) => ({ ...depth }))]
    const bids = [...this.bids.map((depth) => ({ ...depth }))]
    let amountIn: bigint = 0n
    if (
      isAddressEqual(
        tokenIn as `0x${string}`,
        this.quoteToken.address as `0x${string}`,
      )
    ) {
      while (asks.length > 0) {
        const { price, rawAmount } = asks[0]
        const amountOutRaw = this.baseToRaw(amountOut, price, true)
        if (amountOutRaw >= rawAmount) {
          amountOut -= this.rawToBase(rawAmount, price, true)
          amountIn += this.rawToQuote(rawAmount)
          asks.shift()
        } else {
          amountIn += this.rawToQuote(amountOutRaw)
          asks[0].rawAmount = rawAmount - amountOutRaw
          break
        }
      }
    } else {
      while (bids.length > 0) {
        const { price, rawAmount } = bids[0]
        const amountOutRaw = this.quoteToRaw(amountOut, true)
        if (amountOutRaw >= rawAmount) {
          amountOut -= this.rawToQuote(rawAmount)
          amountIn += this.rawToBase(rawAmount, price, true)
          bids.shift()
        } else {
          amountIn += this.rawToBase(amountOutRaw, price, true)
          bids[0].rawAmount = rawAmount - amountOutRaw
          break
        }
      }
    }
    return {
      amountIn,
      market: Market.from(this, bids, asks),
    }
  }

  totalBidsInBaseAfterFees(): bigint {
    const totalBidsInBase = this.bids.reduce(
      (acc, val) => acc + this.rawToBase(val.rawAmount, val.price, false),
      0n,
    )
    return this.divide(
      totalBidsInBase * (this.FEE_PRECISION - this.takerFee),
      this.FEE_PRECISION,
      false,
    )
  }

  totalAsksInBaseAfterFees(): bigint {
    const totalAsksInBase = this.asks.reduce(
      (acc, val) => acc + this.rawToBase(val.rawAmount, val.price, false),
      0n,
    )
    return this.divide(
      totalAsksInBase * (this.FEE_PRECISION - this.takerFee),
      this.FEE_PRECISION,
      false,
    )
  }
}

export const calculateTotalDeposit = (
  markets: Market[],
  initialDeposit: bigint,
): {
  totalDeposit: bigint
  remainingCoupons: { date: string; remainingCoupon: bigint }[]
} => {
  let totalDeposit = initialDeposit
  const amountOuts = [...Array(markets.length).keys()].map(
    () => 2n ** 256n - 1n,
  )
  const remainingCoupons = [...Array(markets.length).keys()].map(() => 0n)
  while (amountOuts.reduce((a, b) => a + b, 0n) > 0n) {
    for (let i = 0; i < markets.length; i++) {
      const totalBidsInBaseAfterFees = markets[i].totalBidsInBaseAfterFees()
      if (totalBidsInBaseAfterFees < initialDeposit) {
        remainingCoupons[i] += initialDeposit - totalBidsInBaseAfterFees
      }
      ;({ market: markets[i], amountOut: amountOuts[i] } = markets[i].spend(
        markets[i].baseToken.address,
        initialDeposit,
      ))
    }
    initialDeposit = amountOuts.reduce((acc, val) => acc + val, 0n)
    totalDeposit = totalDeposit + initialDeposit
  }

  return {
    totalDeposit,
    remainingCoupons: remainingCoupons.map((remainingCoupon) => {
      const date = formatDate(
        new Date(Number(markets.at(-1)?.endTimestamp ?? 0n)),
      )
      return {
        date,
        remainingCoupon,
      }
    }),
  }
}

export const calculateDepositApy = (
  substitute: Currency,
  markets: Market[],
  initialDeposit: bigint,
  currentTimestamp: number,
): {
  proceeds: bigint
  apy: number
} => {
  if (
    markets.some(
      (market) =>
        !isAddressEqual(
          market.quoteToken.address,
          substitute.address as `0x${string}`,
        ),
    )
  ) {
    new Error('Substitute token is not supported')
  }

  const endTimestamp = Math.max(...markets.map((market) => market.endTimestamp))
  const { totalDeposit } = calculateTotalDeposit(markets, initialDeposit)
  const p =
    (Number(totalDeposit) - Number(initialDeposit)) / Number(initialDeposit)
  const d = Number(endTimestamp) - currentTimestamp
  const apy = calculateApy(p, d)

  return {
    apy,
    proceeds: totalDeposit - initialDeposit,
  }
}

export const calculateRemainingCoupons = (
  substitute: Currency,
  markets: Market[],
  initialDeposit: bigint,
): { date: string; remainingCoupon: bigint }[] => {
  if (
    markets.some(
      (market) =>
        !isAddressEqual(
          market.quoteToken.address,
          substitute.address as `0x${string}`,
        ),
    )
  ) {
    new Error('Substitute token is not supported')
  }
  const { remainingCoupons } = calculateTotalDeposit(markets, initialDeposit)
  return remainingCoupons
}

export const calculateBorrowApy = (
  substitute: Currency,
  markets: Market[],
  initialBorrow: bigint,
  maxAmountExcludingFee: bigint,
  currentTimestamp: number,
): {
  interest: bigint
  maxInterest: bigint
  apy: number
  totalBorrow: bigint
  available: bigint
} => {
  if (
    markets.some(
      (market) =>
        !isAddressEqual(
          market.quoteToken.address,
          substitute.address as `0x${string}`,
        ),
    )
  ) {
    new Error('Substitute token is not supported')
  }

  const { interest, maxInterest, available } = calculateCouponsToBorrow(
    substitute,
    markets,
    maxAmountExcludingFee,
    initialBorrow,
  )

  const endTimestamp = Math.max(...markets.map((market) => market.endTimestamp))
  const totalBorrow = initialBorrow - interest
  const p = Number(interest) / Number(totalBorrow)
  const d = Number(endTimestamp) - currentTimestamp
  const apy = calculateApy(p, d)

  return {
    apy,
    interest,
    maxInterest,
    totalBorrow,
    available,
  }
}

export function calculateCouponsToWithdraw(
  substitute: Currency,
  markets: Market[],
  positionAmount: bigint,
  withdrawAmount: bigint,
  numericEpsilon = 0.0001,
): {
  maxRepurchaseFee: bigint
  repurchaseFee: bigint
  available: bigint
} {
  if (
    markets.some(
      (market) =>
        !isAddressEqual(
          market.quoteToken.address,
          substitute.address as `0x${string}`,
        ),
    )
  ) {
    new Error('Substitute token is not supported')
  }

  const availableCoupons = min(
    ...markets.map((market) => market.totalAsksInBaseAfterFees()),
  )
  const available = max(
    availableCoupons -
      markets.reduce(
        (acc, market) =>
          acc + market.take(substitute.address, availableCoupons).amountIn,
        0n,
      ),
    0n,
  )

  const maxRepurchaseFee = markets.reduce(
    (acc, market) =>
      acc + market.take(substitute.address, positionAmount).amountIn,
    0n,
  )
  let repurchaseFee = 0n
  const prevRepurchaseFees = new Set<bigint>()
  while (!prevRepurchaseFees.has(repurchaseFee)) {
    prevRepurchaseFees.add(repurchaseFee)
    repurchaseFee = markets.reduce(
      (acc, market) =>
        acc +
        market.take(substitute.address, withdrawAmount + repurchaseFee)
          .amountIn,
      0n,
    )
  }

  return {
    maxRepurchaseFee,
    repurchaseFee: max(
      BigInt(Math.floor(Number(repurchaseFee) * (1 + numericEpsilon))),
      repurchaseFee,
    ),
    available: BigInt(Math.floor(Number(available) * (1 - numericEpsilon))),
  }
}

export function calculateCouponsToBorrow(
  substitute: Currency,
  markets: Market[],
  maxAmountExcludingFee: bigint,
  borrowAmount: bigint,
  numericEpsilon = 0.0001,
): {
  maxInterest: bigint
  interest: bigint
  available: bigint
} {
  if (
    markets.some(
      (market) =>
        !isAddressEqual(
          market.quoteToken.address,
          substitute.address as `0x${string}`,
        ),
    )
  ) {
    new Error('Substitute token is not supported')
  }

  const availableCoupons = min(
    ...markets.map((market) => market.totalAsksInBaseAfterFees()),
  )
  const available = max(
    availableCoupons -
      markets.reduce(
        (acc, market) =>
          acc + market.take(substitute.address, availableCoupons).amountIn,
        0n,
      ),
    0n,
  )

  const maxInterest = markets.reduce(
    (acc, market) =>
      acc + market.take(substitute.address, maxAmountExcludingFee).amountIn,
    0n,
  )
  let interest = 0n
  const prevInterests = new Set<bigint>()
  while (!prevInterests.has(interest)) {
    prevInterests.add(interest)
    interest = markets.reduce(
      (acc, market) =>
        acc + market.take(substitute.address, borrowAmount + interest).amountIn,
      0n,
    )
  }

  return {
    maxInterest,
    interest: max(
      BigInt(Math.floor(Number(interest) * (1 + numericEpsilon))),
      interest,
    ),
    available: BigInt(Math.floor(Number(available) * (1 - numericEpsilon))),
  }
}

export function calculateCouponsToRepay(
  substitute: Currency,
  markets: Market[],
  positionAmount: bigint,
  repayAmount: bigint,
): {
  maxRefund: bigint
  refund: bigint
} {
  if (
    markets.some(
      (market) =>
        !isAddressEqual(
          market.quoteToken.address,
          substitute.address as `0x${string}`,
        ),
    )
  ) {
    new Error('Substitute token is not supported')
  }

  const maxRefund = markets.reduce(
    (acc, market) =>
      acc + market.spend(market.baseToken.address, positionAmount).amountOut,
    0n,
  )

  let refund = 0n
  const prevRefunds = new Set<bigint>()
  while (!prevRefunds.has(refund)) {
    prevRefunds.add(refund)
    refund = markets.reduce(
      (acc, market) =>
        acc +
        market.spend(market.baseToken.address, repayAmount + refund).amountOut,
      0n,
    )
  }

  return {
    maxRefund: maxRefund,
    refund: refund,
  }
}
