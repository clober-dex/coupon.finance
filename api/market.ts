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

  constructor(
    address: string,
    orderToken: string,
    a: bigint,
    r: bigint,
    d: bigint,
    takerFee: bigint,
    makerFee: bigint,
    quoteUnit: bigint,
    quoteToken: Currency,
    baseToken: Currency,
    quotePrecisionComplement: bigint,
    basePrecisionComplement: bigint,
    bids: Depth[],
    asks: Depth[],
  ) {
    this.address = address
    this.orderToken = orderToken
    this.a = a
    this.r = r
    this.d = d
    this.takerFee = takerFee
    this.makerFee = makerFee
    this.quoteUnit = quoteUnit
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
      market.a,
      market.r,
      market.d,
      market.takerFee,
      market.makerFee,
      market.quoteUnit,
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
      BigInt(dto.a),
      BigInt(dto.r),
      BigInt(dto.d),
      BigInt(dto.takerFee),
      BigInt(dto.makerFee),
      BigInt(dto.quoteUnit),
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

  swap({ tokenIn, amountIn }: { tokenIn: string; amountIn: bigint }): {
    market: Market
    amountOut: bigint
  } {
    const asks = [...this.asks]
    const bids = [...this.bids]
    let amountOut: bigint = 0n
    if (
      isAddressEqual(
        tokenIn as `0x${string}`,
        this.quoteToken.address as `0x${string}`,
      )
    ) {
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
}
