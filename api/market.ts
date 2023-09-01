import { getAddress, isAddressEqual } from 'viem'

import { getBuiltGraphSDK } from '../.graphclient'
import { calculateDepositApy, Market } from '../model/market'
import { Currency } from '../model/currency'
import { Asset } from '../model/asset'
import { getEpoch } from '../utils/epoch'
import { min } from '../utils/bigint'

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
export async function fetchMarkets(): Promise<Market[]> {
  const { markets } = await getMarkets(
    {
      fromEpoch: getEpoch(Math.floor(new Date().getTime() / 1000)).toString(),
    },
    {
      url: process.env.SUBGRAPH_URL,
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
export async function fetchDepositApyByEpochsDeposited(
  asset: Asset,
  amount: bigint,
) {
  const substitute = asset.substitutes[0]
  const markets = (await fetchMarkets())
    .filter((market) =>
      isAddressEqual(market.quoteToken.address, substitute.address),
    )
    .sort((a, b) => Number(a.epoch) - Number(b.epoch))

  const currentTimestamp = Math.floor(new Date().getTime() / 1000)
  return markets
    .map((_, i) => markets.slice(0, i + 1))
    .map((markets) => {
      const { apy, proceeds } = calculateDepositApy(
        substitute,
        markets,
        amount,
        currentTimestamp,
      )
      return {
        date: new Date(Number(markets.at(-1)?.endTimestamp ?? 0n) * 1000)
          .toISOString()
          .slice(2, 10)
          .replace(/-/g, '/'), // TODO: format properly
        proceeds,
        apy,
      }
    })
}

export async function fetchCoupons(
  substitute: Currency,
  positionAmount: bigint,
  withdrawAmount: bigint,
  epoch: number,
): Promise<{
  maxRepurchaseFee: bigint
  repurchaseFee: bigint
  available: bigint
}> {
  const markets = (await fetchMarkets())
    .filter((market) =>
      isAddressEqual(market.quoteToken.address, substitute.address),
    )
    .filter((market) => market.epoch <= epoch)

  const maxRepurchaseFee = markets.reduce(
    (acc, market) =>
      acc + market.take(substitute.address, positionAmount).amountIn,
    0n,
  )
  const repurchaseFee = markets.reduce(
    (acc, market) =>
      acc + market.take(substitute.address, withdrawAmount).amountIn,
    0n,
  )

  const available = min(...markets.map((market) => market.totalAsksInBase()))

  return {
    maxRepurchaseFee,
    repurchaseFee,
    available,
  }
}
