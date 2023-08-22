import { isAddressEqual } from 'viem'

import { Currency } from '../utils/currency'

type DepthDto = {
  price: string
  rawAmount: string
  isBid: boolean
}

type Depth = {
  price: bigint
  rawAmount: bigint
  isBid: boolean
}

export type MarketDto = {
  address: string
  orderToken: string
  a: string
  r: string
  d: string
  takerFee: string
  makerFee: string
  quoteUnit: string
  quoteToken: Currency
  baseToken: Currency
  depths: DepthDto[]
}

export class Market {
  readonly FEE_PRECISION = 10n ** 6n
  readonly PRICE_PRECISION = 10n ** 18n

  address: string
  orderToken: string
  a: bigint
  r: bigint
  d: bigint
  takerFee: bigint
  makerFee: bigint
  quoteUnit: bigint
  quoteToken: Currency
  baseToken: Currency
  quotePrecisionComplement: bigint
  basePrecisionComplement: bigint
  bids: Depth[]
  asks: Depth[]

  constructor(marketDto: MarketDto) {
    this.address = marketDto.address
    this.orderToken = marketDto.orderToken
    this.a = BigInt(marketDto.a)
    this.r = BigInt(marketDto.r)
    this.d = BigInt(marketDto.d)
    this.takerFee = BigInt(marketDto.takerFee)
    this.makerFee = BigInt(marketDto.makerFee)
    this.quoteUnit = BigInt(marketDto.quoteUnit)
    this.quoteToken = marketDto.quoteToken
    this.baseToken = marketDto.baseToken
    this.quotePrecisionComplement =
      10n ** (18n - BigInt(this.quoteToken.decimals))
    this.basePrecisionComplement =
      10n ** (18n - BigInt(this.baseToken.decimals))

    this.bids = marketDto.depths
      .filter((depth) => depth.isBid)
      .sort((a, b) => {
        return Number(b.price) - Number(a.price)
      })
      .map((depth) => ({
        price: BigInt(depth.price),
        rawAmount: BigInt(depth.rawAmount),
        isBid: depth.isBid,
      }))
    this.asks = marketDto.depths
      .filter((depth) => !depth.isBid)
      .sort((a, b) => {
        return Number(a.price) - Number(b.price)
      })
      .map((depth) => ({
        price: BigInt(depth.price),
        rawAmount: BigInt(depth.rawAmount),
        isBid: depth.isBid,
      }))
  }

  private roundDiv(x: bigint, y: bigint, roundUp: boolean): bigint {
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
    return this.roundDiv(amount, this.quoteUnit, roundUp)
  }

  private rawToQuote(rawAmount: bigint): bigint {
    return rawAmount * this.quoteUnit
  }

  private baseToRaw(amount: bigint, price: bigint, roundUp: boolean): bigint {
    return this.roundDiv(
      amount * price * this.basePrecisionComplement,
      this.PRICE_PRECISION * this.quotePrecisionComplement * this.quoteUnit,
      roundUp,
    )
  }

  private rawToBase(rawQty: bigint, price: bigint, roundUp: boolean): bigint {
    return this.roundDiv(
      this.rawToQuote(rawQty) *
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
    return this.roundDiv(
      takeAmount * this.takerFee,
      this.FEE_PRECISION,
      roundUp,
    )
  }

  swap({ tokenIn, amountIn }: { tokenIn: string; amountIn: bigint }): bigint {
    let amountOut: bigint = BigInt(0)
    if (
      isAddressEqual(
        tokenIn as `0x${string}`,
        this.quoteToken.address as `0x${string}`,
      )
    ) {
      while (this.asks.length > 0) {
        const { price, rawAmount } = this.asks[0]
        const amountInRaw = this.quoteToRaw(amountIn, false)
        if (amountInRaw >= rawAmount) {
          amountIn -= this.rawToQuote(rawAmount)
          amountOut += this.rawToBase(rawAmount, price, false)
          this.asks.shift()
        } else {
          amountOut += this.rawToBase(amountInRaw, price, false)
          this.asks[0].rawAmount = rawAmount - amountInRaw
          break
        }
      }
    } else {
      while (this.bids.length > 0) {
        const { price, rawAmount } = this.bids[0]
        const amountInRaw = this.baseToRaw(amountIn, price, false)
        if (amountInRaw >= rawAmount) {
          amountIn -= this.rawToBase(rawAmount, price, true)
          amountOut += this.rawToQuote(rawAmount)
          this.bids.shift()
        } else {
          amountOut += this.rawToQuote(amountInRaw)
          this.bids[0].rawAmount = rawAmount - amountInRaw
          break
        }
      }
    }
    amountOut -= this.calculateTakerFeeAmount(amountOut, true)
    return amountOut
  }
}
