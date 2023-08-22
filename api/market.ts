import { BigNumber } from 'ethers'
import { isAddressEqual } from 'viem'

import { Currency } from '../utils/currency'

type DepthDto = {
  price: string
  rawAmount: string
  isBid: boolean
}

type Depth = {
  price: BigNumber
  rawAmount: BigNumber
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
  readonly FEE_PRECISION = BigNumber.from(1000000)

  address: string
  orderToken: string
  a: BigNumber
  r: BigNumber
  d: BigNumber
  takerFee: BigNumber
  makerFee: BigNumber
  quoteUnit: BigNumber
  quoteToken: Currency
  baseToken: Currency
  quotePrecisionComplement: BigNumber
  basePrecisionComplement: BigNumber
  bids: Depth[]
  asks: Depth[]

  constructor(marketDto: MarketDto) {
    this.address = marketDto.address
    this.orderToken = marketDto.orderToken
    this.a = BigNumber.from(marketDto.a)
    this.r = BigNumber.from(marketDto.r)
    this.d = BigNumber.from(marketDto.d)
    this.takerFee = BigNumber.from(marketDto.takerFee)
    this.makerFee = BigNumber.from(marketDto.makerFee)
    this.quoteUnit = BigNumber.from(marketDto.quoteUnit)
    this.quoteToken = marketDto.quoteToken
    this.baseToken = marketDto.baseToken
    this.quotePrecisionComplement = BigNumber.from(10).pow(
      18 - this.quoteToken.decimals,
    )
    this.basePrecisionComplement = BigNumber.from(10).pow(
      18 - this.baseToken.decimals,
    )

    this.bids = marketDto.depths
      .filter((depth) => depth.isBid)
      .sort((a, b) => {
        return Number(b.price) - Number(a.price)
      })
      .map((depth) => ({
        price: BigNumber.from(depth.price),
        rawAmount: BigNumber.from(depth.rawAmount),
        isBid: depth.isBid,
      }))
    this.asks = marketDto.depths
      .filter((depth) => !depth.isBid)
      .sort((a, b) => {
        return Number(a.price) - Number(b.price)
      })
      .map((depth) => ({
        price: BigNumber.from(depth.price),
        rawAmount: BigNumber.from(depth.rawAmount),
        isBid: depth.isBid,
      }))
  }

  private roundDiv(x: BigNumber, y: BigNumber, roundUp: boolean): BigNumber {
    if (roundUp) {
      if (x.isZero()) {
        return BigNumber.from(0)
      } else {
        return x.sub(1).div(y).add(1)
      }
    } else {
      return x.div(y)
    }
  }

  private quoteToRaw(amount: BigNumber, roundUp: boolean): BigNumber {
    return this.roundDiv(amount, this.quoteUnit, roundUp)
  }

  private rawToQuote(rawQty: BigNumber): BigNumber {
    return rawQty.mul(this.quoteUnit)
  }

  private baseToRaw(
    amount: BigNumber,
    price: BigNumber,
    roundUp: boolean,
  ): BigNumber {
    return this.roundDiv(
      amount.mul(price).mul(this.basePrecisionComplement),
      BigNumber.from(10)
        .pow(18)
        .mul(this.quotePrecisionComplement)
        .mul(this.quoteUnit),
      roundUp,
    )
  }

  private rawToBase(
    rawQty: BigNumber,
    price: BigNumber,
    roundUp: boolean,
  ): BigNumber {
    return this.roundDiv(
      this.rawToQuote(rawQty)
        .mul(BigNumber.from(10).pow(18))
        .mul(this.quotePrecisionComplement),
      price.mul(this.basePrecisionComplement),
      roundUp,
    )
  }

  private calculateTakerFeeAmount(
    takeAmount: BigNumber,
    roundUp: boolean,
  ): BigNumber {
    return this.roundDiv(
      takeAmount.mul(this.takerFee),
      this.FEE_PRECISION,
      roundUp,
    )
  }

  swap({
    tokenIn,
    amountIn,
  }: {
    tokenIn: string
    amountIn: BigNumber
  }): BigNumber {
    let amountOut: BigNumber = BigNumber.from(0)
    if (
      isAddressEqual(
        tokenIn as `0x${string}`,
        this.quoteToken.address as `0x${string}`,
      )
    ) {
      while (this.asks.length > 0) {
        const { price, rawAmount: rawQty } = this.asks[0]
        const amountInRaw = this.quoteToRaw(amountIn, false)
        if (amountInRaw.gte(rawQty)) {
          amountIn = amountIn.sub(this.rawToQuote(rawQty))
          amountOut = amountOut.add(this.rawToBase(rawQty, price, false))
          this.asks.shift()
        } else {
          amountOut = amountOut.add(this.rawToBase(amountInRaw, price, false))
          this.asks[0].rawAmount = rawQty.sub(amountInRaw)
          break
        }
      }
    } else {
      while (this.bids.length > 0) {
        const { price, rawAmount: rawQty } = this.bids[0]
        const amountInRaw = this.baseToRaw(amountIn, price, false)
        if (amountInRaw.gte(rawQty)) {
          amountIn = amountIn.sub(this.rawToBase(rawQty, price, true))
          amountOut = amountOut.add(this.rawToQuote(rawQty))
          this.bids.shift()
        } else {
          amountOut = amountOut.add(this.rawToQuote(amountInRaw))
          this.bids[0].rawAmount = rawQty.sub(amountInRaw)
          break
        }
      }
    }
    amountOut = amountOut.sub(this.calculateTakerFeeAmount(amountOut, true))
    return amountOut
  }
}
