import { getAddress, isAddressEqual } from 'viem'

import { getBuiltGraphSDK } from '../.graphclient'
import {
  calculateBorrowApy,
  calculateDepositInfos,
  Market,
} from '../model/market'
import { Currency } from '../model/currency'
import { Asset } from '../model/asset'
import { getEpoch } from '../utils/epoch'
import { SUBGRAPH_URL } from '../constants/subgraph-url'
import { CHAIN_IDS } from '../constants/chain'
import { currentTimestampInSeconds, formatDate } from '../utils/date'
const { getMarkets } = getBuiltGraphSDK()

type DepthDto = {
  price: string
  rawAmount: string
  isBid: boolean
}

export type MarketDto = {
  address: string
  orderToken: string
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
  const { markets } = await getMarkets(
    {
      fromEpoch: getEpoch(currentTimestampInSeconds()).toString(),
    },
    {
      url: SUBGRAPH_URL[chainId],
    },
  )
  return markets.map((market) =>
    Market.fromDto({
      address: getAddress(market.id),
      orderToken: getAddress(market.orderToken),
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
      depths: market.depths.map((depth) => ({
        price: depth.price,
        rawAmount: depth.rawAmount,
        isBid: depth.isBid,
      })),
    }),
  )
}

// Returns an array with the of proceeds depending on how many epochs deposited.
export async function fetchDepositInfosByEpochsDeposited(
  chainId: CHAIN_IDS,
  asset: Asset,
  amount: bigint,
) {
  const substitute = asset.substitutes[0]
  const markets = (await fetchMarkets(chainId))
    .filter((market) =>
      isAddressEqual(market.quoteToken.address, substitute.address),
    )
    .sort((a, b) => Number(a.epoch) - Number(b.epoch))

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
) {
  const substitute = asset.substitutes[0]
  const markets = (await fetchMarkets(chainId))
    .filter((market) =>
      isAddressEqual(market.quoteToken.address, substitute.address),
    )
    .sort((a, b) => Number(a.epoch) - Number(b.epoch))

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
        interest,
        maxInterest,
        apy,
        available,
      }
    })
}

export async function fetchCouponAmountByEpochsBorrowed(
  chainId: CHAIN_IDS,
  substitute: Currency,
  debtAmount: bigint,
  expiryEpoch: number,
) {
  const markets = (await fetchMarkets(chainId))
    .filter((market) =>
      isAddressEqual(market.quoteToken.address, substitute.address),
    )
    .sort((a, b) => Number(a.epoch) - Number(b.epoch))

  return markets.map((market) => {
    const interest =
      market.epoch > expiryEpoch
        ? market.take(market.quoteToken.address, debtAmount).amountIn
        : 0n
    const refund =
      market.epoch < expiryEpoch
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
