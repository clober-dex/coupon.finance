import { getAddress, isAddressEqual } from 'viem'

import {
  calculateBorrowApy,
  calculateDepositInfos,
  Market,
} from '../model/market'
import { Currency } from '../model/currency'
import { Asset } from '../model/asset'
import { CHAIN_IDS } from '../constants/chain'
import { currentTimestampInSeconds, formatDate } from '../utils/date'
import { MAX_VISIBLE_MARKETS } from '../utils/market'

type DepthDto = {
  price: string
  rawAmount: string
  isBid: boolean
}

export type MarketDto = {
  address: string
  orderToken: string
  couponId: string
  takerFee: string
  quoteUnit: string
  epoch: {
    id: string
    startTimestamp: string
    endTimestamp: string
  }
  quoteToken: Currency
  baseToken: Currency
  depths: DepthDto[]
}
export async function fetchMarkets(chainId: CHAIN_IDS): Promise<Market[]> {
  // TODO: replace with v2 markets
  // const { markets } = await getMarkets(
  //   {},
  //   {
  //     url: SUBGRAPH_URL[chainId],
  //   },
  // )
  const markets: any[] = []
  const now = currentTimestampInSeconds()
  return markets
    .filter((market) => Number(market.epoch.endTimestamp) > now)
    .map((market) =>
      Market.fromDto({
        address: getAddress(market.id),
        orderToken: getAddress(market.orderToken),
        couponId: market.couponId,
        takerFee: market.takerFee,
        quoteUnit: market.quoteUnit,
        epoch: {
          id: market.epoch.id,
          startTimestamp: market.epoch.startTimestamp,
          endTimestamp: market.epoch.endTimestamp,
        },
        quoteToken: {
          address: getAddress(market.quoteToken.id),
          name: market.quoteToken.name,
          symbol: market.quoteToken.symbol,
          decimals: market.quoteToken.decimals,
        },
        baseToken: {
          address: getAddress(market.baseToken.id),
          name: market.baseToken.name,
          symbol: market.baseToken.symbol,
          decimals: market.baseToken.decimals,
        },
        depths: market.depths.map((depth: any) => ({
          price: depth.price,
          rawAmount: depth.rawAmount,
          isBid: depth.isBid,
        })),
      }),
    )
    .sort((a, b) => Number(a.epoch) - Number(b.epoch))
}

export async function fetchMarketsByQuoteTokenAddress(
  chainId: CHAIN_IDS,
  quoteTokenAddress: `0x${string}`,
): Promise<Market[]> {
  return (await fetchMarkets(chainId)).filter((market) =>
    isAddressEqual(market.quoteToken.address, quoteTokenAddress),
  )
}

// Returns an array with the of proceeds depending on how many epochs deposited.
export async function fetchDepositInfosByEpochsDeposited(
  chainId: CHAIN_IDS,
  asset: Asset,
  amount: bigint,
  maxVisibleMarkets: number = MAX_VISIBLE_MARKETS,
) {
  const substitute = asset.substitutes[0]
  const markets = (
    await fetchMarketsByQuoteTokenAddress(chainId, substitute.address)
  ).slice(0, maxVisibleMarkets)

  const currentTimestamp = currentTimestampInSeconds()
  return markets
    .map((_, index) => markets.slice(0, index + 1))
    .map((markets) => {
      const { apy, proceeds, remainingCoupons } = calculateDepositInfos(
        substitute,
        markets,
        amount,
        currentTimestamp,
      )
      return {
        date: formatDate(
          new Date(Number(markets.at(-1)?.endTimestamp ?? 0n) * 1000),
        ),
        endTimestamp: Number(markets.at(-1)?.endTimestamp ?? 0n),
        proceeds,
        apy,
        remainingCoupons,
      }
    })
}

export async function fetchBorrowApyByEpochsBorrowed(
  chainId: CHAIN_IDS,
  asset: Asset,
  amount: bigint,
  maxAmountExcludingFee: bigint,
  maxVisibleMarkets: number = MAX_VISIBLE_MARKETS,
) {
  const substitute = asset.substitutes[0]
  const markets = (
    await fetchMarketsByQuoteTokenAddress(chainId, substitute.address)
  ).slice(0, maxVisibleMarkets)

  const currentTimestamp = currentTimestampInSeconds()
  return markets
    .map((_, index) => markets.slice(0, index + 1))
    .map((markets) => {
      const { apy, interest, maxInterest, available } = calculateBorrowApy(
        substitute,
        markets,
        amount,
        maxAmountExcludingFee,
        currentTimestamp,
      )
      return {
        date: formatDate(
          new Date(Number(markets.at(-1)?.endTimestamp ?? 0n) * 1000),
        ),
        endTimestamp: Number(markets.at(-1)?.endTimestamp ?? 0n),
        interest,
        maxInterest,
        apy,
        available,
      }
    })
}

export async function fetchInterestOrRefundCouponAmountByEpochs(
  chainId: CHAIN_IDS,
  substitute: Currency,
  debtAmount: bigint,
  expiryEpoch: number,
  maxVisibleMarkets: number = MAX_VISIBLE_MARKETS,
) {
  const markets = (
    await fetchMarketsByQuoteTokenAddress(chainId, substitute.address)
  ).slice(0, maxVisibleMarkets)

  return markets.map((market) => {
    const interest =
      market.epoch > expiryEpoch
        ? market.take(market.quoteToken.address, debtAmount).amountIn
        : 0n
    const refund =
      market.epoch <= expiryEpoch
        ? market.spend(market.baseToken.address, debtAmount).amountOut
        : 0n
    return {
      date: formatDate(new Date(Number(market.endTimestamp) * 1000)),
      interest,
      payable: debtAmount <= market.totalAsksInBaseAfterFees(),
      refund,
      refundable: debtAmount <= market.totalBidsInBaseAfterFees(),
      expiryEpoch: market.epoch === expiryEpoch,
    }
  })
}
