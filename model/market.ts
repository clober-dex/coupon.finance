import { isAddressEqual } from 'viem'

import { MarketDto } from '../api/market'
import { YEAR_IN_SECONDS } from '../utils/epoch'

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
  epoch: bigint
  startTimestamp: bigint
  endTimestamp: bigint
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
    epoch: bigint,
    startTimestamp: bigint,
    endTimestamp: bigint,
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
      BigInt(dto.epoch),
      BigInt(dto.startTimestamp),
      BigInt(dto.endTimestamp),
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

  private rawToBase(
    rawAmount: bigint,
    price: bigint,
    roundUp: boolean,
  ): bigint {
    return this.roundDiv(
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
    return this.roundDiv(
      takeAmount * this.takerFee,
      this.FEE_PRECISION,
      roundUp,
    )
  }

  clone(): Market {
    return Object.create(
      Object.getPrototypeOf(this),
      Object.getOwnPropertyDescriptors(this),
    )
  }

  swap(
    tokenIn: string,
    amountIn: bigint,
  ): {
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

export const calculateTotalDeposit = (
  markets: Market[],
  initialDeposit: bigint,
): bigint => {
  let totalDeposit = initialDeposit
  const amountOuts = [...Array(markets.length).keys()].map(
    () => 2n ** 256n - 1n,
  )

  while (amountOuts.reduce((a, b) => a + b, 0n) > 0n) {
    for (let i = 0; i < markets.length; i++) {
      ;({ market: markets[i], amountOut: amountOuts[i] } = markets[i].swap(
        markets[i].baseToken.address,
        initialDeposit,
      ))
    }
    initialDeposit = amountOuts.reduce((acc, val) => acc + val, 0n)
    totalDeposit = totalDeposit + initialDeposit
  }

  return totalDeposit
}

export const calculateDepositApy = (
  substitute: Currency,
  markets: Market[],
  initialDeposit: bigint,
  currentTimestamp: number,
): {
  startTimestamp: Date
  startEpoch: bigint
  endTimestamp: Date
  endEpoch: bigint
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

  const sortedMarkets = markets.sort(
    (a, b) => Number(a.epoch) - Number(b.epoch),
  )
  const startTimestamp = Number(sortedMarkets[0].startTimestamp)
  const endTimestamp = Number(
    sortedMarkets[sortedMarkets.length - 1].endTimestamp,
  )

  const totalDeposit = calculateTotalDeposit(markets, initialDeposit)
  const apy =
    totalDeposit === initialDeposit
      ? 0
      : ((Number(totalDeposit) / Number(initialDeposit)) * YEAR_IN_SECONDS) /
        (endTimestamp - currentTimestamp)

  return {
    apy,
    startTimestamp: new Date(startTimestamp * 1000),
    startEpoch: sortedMarkets[0].epoch,
    endTimestamp: new Date(endTimestamp * 1000),
    endEpoch: sortedMarkets[sortedMarkets.length - 1].epoch,
    proceeds: totalDeposit - initialDeposit,
  }
}
