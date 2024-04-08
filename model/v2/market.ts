import { isAddressEqual } from 'viem'

import { getMarketId } from '../../utils/v2/market'
import { CHAIN_IDS } from '../../constants/chain'
import {
  baseToQuote,
  divide,
  fromPrice,
  invertPrice,
  MIN_TICK,
  quoteToBase,
  toPrice,
} from '../../utils/v2/tick'
import { formatPrice } from '../../utils/v2/prices'
import { formatDate } from '../../utils/date'
import { calculateApy } from '../../utils/apy'
import { max, min } from '../../utils/bigint'
import { Epoch } from '../epoch'

import { Book } from './book'
import { Currency } from './currency'
import { Depth, MarketDepth } from './depth'
import { FeePolicy } from './fee-policy'

export type RemainingCoupon = {
  date: string
  remainingCoupon: bigint
  symbol: string
}

export class Market {
  chainId: CHAIN_IDS
  id: string
  quote: Currency
  base: Currency
  makerPolicy: FeePolicy
  hooks: `0x${string}`
  takerPolicy: FeePolicy
  latestPrice: number
  latestTimestamp: number
  bids: MarketDepth[]
  asks: MarketDepth[]
  books: Book[]

  constructor({
    chainId,
    tokens,
    makerPolicy,
    hooks,
    takerPolicy,
    latestPrice,
    latestTimestamp,
    books,
  }: {
    chainId: CHAIN_IDS
    tokens: [Currency, Currency]
    makerPolicy: FeePolicy
    hooks: `0x${string}`
    takerPolicy: FeePolicy
    latestPrice: number
    latestTimestamp: number
    books: Book[]
  }) {
    const { marketId, quote, base } = getMarketId(
      chainId,
      tokens.map((token) => token.address),
    )
    this.chainId = chainId
    this.id = marketId
    this.quote = tokens.find((token) => isAddressEqual(token.address, quote))!
    this.base = tokens.find((token) => isAddressEqual(token.address, base))!
    this.makerPolicy = makerPolicy
    this.hooks = hooks
    this.takerPolicy = takerPolicy
    this.latestPrice = latestPrice
    this.latestTimestamp = latestTimestamp
    this.bids = books
      .filter((book) => isAddressEqual(book.quote.address, this.quote.address))
      .flatMap((book) => book.depths)
      .map(
        (depth) =>
          ({
            tick: depth.tick,
            price: formatPrice(
              toPrice(depth.tick),
              this.quote.decimals,
              this.base.decimals,
            ),
            baseAmount: quoteToBase(
              depth.tick,
              depth.rawAmount * depth.unit,
              false,
            ),
          } as MarketDepth),
      )
    this.asks = books
      .filter((book) => isAddressEqual(book.quote.address, this.base.address))
      .flatMap((book) => book.depths)
      .map((depth) => {
        const price = invertPrice(toPrice(depth.tick))
        const tick = fromPrice(price)
        const readablePrice = formatPrice(
          price,
          this.quote.decimals,
          this.base.decimals,
        )
        const baseAmount = depth.rawAmount * depth.unit
        return {
          tick,
          price: readablePrice,
          baseAmount,
        } as MarketDepth
      })
    this.books = books
  }

  static from(market: Market, newDepths: Depth[]): Market {
    const books = market.books.map((book) => {
      const newDepthsForBook = newDepths.filter(
        (depth) => depth.bookId === book.id.toString(),
      )
      return Book.from(book, newDepthsForBook)
    })
    return new Market({
      chainId: market.chainId,
      tokens: [market.quote, market.base],
      makerPolicy: market.makerPolicy,
      hooks: market.hooks,
      takerPolicy: market.takerPolicy,
      latestPrice: market.latestPrice,
      latestTimestamp: market.latestTimestamp,
      books,
    })
  }

  take = ({
    takeQuote,
    limitPrice,
    amountOut, // quote if takeQuote, base otherwise
  }: {
    takeQuote: boolean
    limitPrice: bigint
    amountOut: bigint
  }) => {
    if (takeQuote) {
      const bidDepths = this.books
        .filter((book) =>
          isAddressEqual(book.quote.address, this.quote.address),
        )
        .flatMap((book) => book.depths)
      return this.takeInner({ depthsOrigin: bidDepths, limitPrice, amountOut })
    } else {
      const askDepths = this.books
        .filter((book) => isAddressEqual(book.quote.address, this.base.address))
        .flatMap((book) => book.depths)
      return this.takeInner({
        depthsOrigin: askDepths,
        limitPrice: invertPrice(limitPrice),
        amountOut,
      })
    }
  }

  spend = ({
    spendBase,
    limitPrice,
    amountIn, // base if spendBase, quote otherwise
  }: {
    spendBase: boolean
    limitPrice: bigint
    amountIn: bigint
  }) => {
    if (spendBase) {
      const bidDepths = this.books
        .filter((book) =>
          isAddressEqual(book.quote.address, this.quote.address),
        )
        .flatMap((book) => book.depths)
      return this.spendInner({ depthsOrigin: bidDepths, limitPrice, amountIn })
    } else {
      const askDepths = this.books
        .filter((book) => isAddressEqual(book.quote.address, this.base.address))
        .flatMap((book) => book.depths)
      return this.spendInner({
        depthsOrigin: askDepths,
        limitPrice: invertPrice(limitPrice),
        amountIn,
      })
    }
  }

  takeInner = ({
    depthsOrigin, // only bid orders
    limitPrice,
    amountOut, // quote
  }: {
    depthsOrigin: Depth[]
    limitPrice: bigint
    amountOut: bigint
  }) => {
    const depths = [...depthsOrigin.map((depth) => ({ ...depth }))]
    if (depths.length === 0) {
      return {
        newMarket: Market.from(this, []),
        amountIn: 0n,
        takeResult: {},
      }
    }
    const takeResult: {
      [key in string]: {
        takenAmount: bigint
        spendAmount: bigint
      }
    } = {}
    for (const depth of depths) {
      if (!takeResult[depth.bookId]) {
        takeResult[depth.bookId] = {
          takenAmount: 0n,
          spendAmount: 0n,
        }
      }
    }
    let totalTakenQuoteAmount = 0n

    const ticks = depths
      .sort((a, b) => Number(b.tick) - Number(a.tick))
      .map((depth) => depth.tick)
    let index = 0
    let tick = ticks[index]
    let amountIn = 0n
    while (tick > -8388608n) {
      if (limitPrice > toPrice(tick)) {
        break
      }
      const currentDepth = depths.find((depth) => depth.tick === tick)!
      const currentBook = this.books.find(
        (book) => book.id === BigInt(currentDepth.bookId),
      )!
      let maxAmount = this.takerPolicy.usesQuote
        ? this.takerPolicy.calculateOriginalAmount(
            amountOut - totalTakenQuoteAmount,
            true,
          )
        : amountOut - totalTakenQuoteAmount
      maxAmount = divide(maxAmount, currentBook.unit, true)

      if (maxAmount === 0n) {
        break
      }
      let quoteAmount =
        (currentDepth.rawAmount > maxAmount
          ? maxAmount
          : currentDepth.rawAmount) * currentBook.unit
      let baseAmount = quoteToBase(tick, quoteAmount, true)
      if (this.takerPolicy.usesQuote) {
        quoteAmount =
          quoteAmount - this.takerPolicy.calculateFee(quoteAmount, false)
      } else {
        baseAmount =
          baseAmount + this.takerPolicy.calculateFee(baseAmount, false)
      }
      if (quoteAmount === 0n) {
        break
      }

      takeResult[currentDepth.bookId].takenAmount += quoteAmount
      takeResult[currentDepth.bookId].spendAmount += baseAmount
      amountIn += baseAmount
      totalTakenQuoteAmount += quoteAmount
      currentDepth.rawAmount -= quoteAmount / currentBook.unit
      if (amountOut <= totalTakenQuoteAmount) {
        break
      }
      if (ticks.length === index + 1) {
        break
      }
      index++
      tick = ticks[index]
    }
    const newDepths = depths.filter((depth) => depth.rawAmount > 0)
    return {
      newMarket: Market.from(this, newDepths),
      amountIn,
      takeResult: Object.fromEntries(
        Object.entries(takeResult).filter(
          ([, value]) => value.spendAmount > 0 && value.takenAmount > 0,
        ),
      ),
    }
  }

  spendInner = ({
    depthsOrigin, // only bid orders
    limitPrice,
    amountIn, // base
  }: {
    depthsOrigin: Depth[]
    limitPrice: bigint
    amountIn: bigint
  }) => {
    const depths = [...depthsOrigin.map((depth) => ({ ...depth }))]
    if (depths.length === 0) {
      return {
        newMarket: Market.from(this, []),
        amountOut: 0n,
        spendResult: {},
      }
    }
    const spendResult: {
      [key in string]: {
        takenAmount: bigint
        spendAmount: bigint
      }
    } = {}
    for (const depth of depths) {
      if (!spendResult[depth.bookId]) {
        spendResult[depth.bookId] = {
          takenAmount: 0n,
          spendAmount: 0n,
        }
      }
    }
    let totalSpendBaseAmount = 0n

    const ticks = depths
      .sort((a, b) => Number(b.tick) - Number(a.tick))
      .map((depth) => depth.tick)
    let index = 0
    let tick = ticks[index]
    let amountOut = 0n
    while (totalSpendBaseAmount <= amountIn && tick > -8388608n) {
      if (limitPrice > toPrice(tick)) {
        break
      }
      const currentDepth = depths.find((depth) => depth.tick === tick)!
      const currentBook = this.books.find(
        (book) => book.id === BigInt(currentDepth.bookId),
      )!
      let maxAmount = this.takerPolicy.usesQuote
        ? amountIn - totalSpendBaseAmount
        : this.takerPolicy.calculateOriginalAmount(
            amountIn - totalSpendBaseAmount,
            false,
          )
      maxAmount = baseToQuote(tick, maxAmount, false) / currentBook.unit

      if (maxAmount === 0n) {
        break
      }
      let quoteAmount =
        (currentDepth.rawAmount > maxAmount
          ? maxAmount
          : currentDepth.rawAmount) * currentBook.unit
      let baseAmount = quoteToBase(tick, quoteAmount, true)
      if (this.takerPolicy.usesQuote) {
        quoteAmount =
          quoteAmount - this.takerPolicy.calculateFee(quoteAmount, false)
      } else {
        baseAmount =
          baseAmount + this.takerPolicy.calculateFee(baseAmount, false)
      }
      if (baseAmount === 0n) {
        break
      }

      spendResult[currentDepth.bookId].takenAmount += quoteAmount
      spendResult[currentDepth.bookId].spendAmount += baseAmount
      totalSpendBaseAmount += baseAmount
      amountOut += quoteAmount
      currentDepth.rawAmount -= quoteAmount / currentBook.unit
      if (ticks.length === index + 1) {
        break
      }
      index++
      tick = ticks[index]
    }
    const newDepths = depths.filter((depth) => depth.rawAmount > 0)
    return {
      newMarket: Market.from(this, newDepths),
      amountOut,
      spendResult: Object.fromEntries(
        Object.entries(spendResult).filter(
          ([, value]) => value.spendAmount > 0 && value.takenAmount > 0,
        ),
      ),
    }
  }

  // TODO: re-check this function
  totalBidsInBaseAfterFees(): bigint {
    const totalBidsInBase = this.bids.reduce(
      (acc, val) => acc + val.baseAmount,
      0n,
    )
    return this.takerPolicy.usesQuote
      ? totalBidsInBase
      : totalBidsInBase + this.takerPolicy.calculateFee(totalBidsInBase, false)
  }

  // TODO: re-check this function
  totalAsksInBaseAfterFees(): bigint {
    const totalAsksInBase = this.asks.reduce(
      (acc, val) => acc + val.baseAmount,
      0n,
    )
    return this.takerPolicy.usesQuote
      ? totalAsksInBase - this.takerPolicy.calculateFee(totalAsksInBase, false)
      : totalAsksInBase
  }
}

export const calculateTotalDeposit = (
  markets: Market[],
  epochs: Epoch[],
  initialDeposit: bigint,
): {
  totalDeposit: bigint
  remainingCoupons: RemainingCoupon[]
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
      ;({ newMarket: markets[i], amountOut: amountOuts[i] } = markets[i].spend({
        spendBase: true,
        limitPrice: toPrice(MIN_TICK),
        amountIn: initialDeposit,
      }))
    }
    initialDeposit = amountOuts.reduce((acc, val) => acc + val, 0n)
    totalDeposit = totalDeposit + initialDeposit
  }

  return {
    totalDeposit,
    remainingCoupons: remainingCoupons.map((remainingCoupon, index) => {
      return {
        date: formatDate(
          new Date(Number(epochs[index].endTimestamp ?? 0n) * 1000),
        ),
        symbol: markets[index].base.symbol,
        remainingCoupon,
      }
    }),
  }
}

export const calculateDepositInfos = (
  substitute: Currency,
  markets: Market[],
  epochs: Epoch[],
  initialDeposit: bigint,
  currentTimestamp: number,
): {
  proceeds: bigint
  apy: number
  remainingCoupons: RemainingCoupon[]
} => {
  if (
    markets.some(
      (market) =>
        !isAddressEqual(
          market.quote.address,
          substitute.address as `0x${string}`,
        ),
    )
  ) {
    new Error('Substitute token is not supported')
  }

  const endTimestamp = Math.max(...epochs.map((e) => e.endTimestamp))
  const { totalDeposit, remainingCoupons } = calculateTotalDeposit(
    markets,
    epochs,
    initialDeposit,
  )
  const p =
    (Number(totalDeposit) - Number(initialDeposit)) / Number(totalDeposit)
  const d = Number(endTimestamp) - currentTimestamp
  const apy = calculateApy(p, d)

  return {
    apy,
    proceeds: totalDeposit - initialDeposit,
    remainingCoupons,
  }
}

export const calculateBorrowApy = (
  substitute: Currency,
  markets: Market[],
  epochs: Epoch[],
  initialBorrow: bigint,
  maxAmountExcludingFee: bigint,
  currentTimestamp: number,
): {
  interest: bigint
  maxInterest: bigint
  apy: number
  available: bigint
} => {
  if (
    markets.some(
      (market) =>
        !isAddressEqual(
          market.quote.address,
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

  const endTimestamp = Math.max(...epochs.map((e) => e.endTimestamp))
  const totalBorrow = initialBorrow + interest
  const p = Number(interest) / Number(totalBorrow)
  const d = Number(endTimestamp) - currentTimestamp
  const apy = calculateApy(p, d)

  return {
    apy,
    interest,
    maxInterest,
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
          market.quote.address,
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
          acc +
          (market.take({
            takeQuote: false,
            limitPrice: toPrice(MIN_TICK),
            amountOut: availableCoupons,
          })?.amountIn ?? 0n),
        0n,
      ),
    0n,
  )

  const maxRepurchaseFee = markets.reduce(
    (acc, market) =>
      acc +
      market.take({
        takeQuote: false,
        limitPrice: toPrice(MIN_TICK),
        amountOut: positionAmount,
      }).amountIn,
    0n,
  )
  let repurchaseFee = 0n
  const prevRepurchaseFees = new Set<bigint>()
  while (!prevRepurchaseFees.has(repurchaseFee)) {
    prevRepurchaseFees.add(repurchaseFee)
    repurchaseFee = markets.reduce(
      (acc, market) =>
        acc +
        market.take({
          takeQuote: false,
          limitPrice: toPrice(MIN_TICK),
          amountOut: withdrawAmount + repurchaseFee,
        }).amountIn,
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
          market.quote.address,
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
          acc +
          market.take({
            takeQuote: false,
            limitPrice: toPrice(MIN_TICK),
            amountOut: availableCoupons,
          }).amountIn,
        0n,
      ),
    0n,
  )

  const maxInterest = markets.reduce(
    (acc, market) =>
      acc +
      market.take({
        takeQuote: false,
        limitPrice: toPrice(MIN_TICK),
        amountOut: maxAmountExcludingFee,
      }).amountIn,
    0n,
  )
  let interest = 0n
  const prevInterests = new Set<bigint>()
  while (!prevInterests.has(interest)) {
    prevInterests.add(interest)
    interest = markets.reduce(
      (acc, market) =>
        acc +
        market.take({
          takeQuote: false,
          limitPrice: toPrice(MIN_TICK),
          amountOut: borrowAmount + interest,
        }).amountIn,
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
          market.quote.address,
          substitute.address as `0x${string}`,
        ),
    )
  ) {
    new Error('Substitute token is not supported')
  }

  const maxRefund = markets.reduce(
    (acc, market) =>
      acc +
      market.spend({
        spendBase: true,
        limitPrice: toPrice(MIN_TICK),
        amountIn: positionAmount,
      }).amountOut,
    0n,
  )

  let refund = 0n
  const prevRefunds = new Set<bigint>()
  while (!prevRefunds.has(refund)) {
    prevRefunds.add(refund)
    refund = markets.reduce(
      (acc, market) =>
        acc +
        market.spend({
          spendBase: true,
          limitPrice: toPrice(MIN_TICK),
          amountIn: repayAmount + refund,
        }).amountOut,
      0n,
    )
  }

  return {
    maxRefund,
    refund,
  }
}
