import { getAddress, isAddressEqual } from 'viem'

import { getBuiltGraphSDK } from '../.graphclient'
import { calculateDepositApy, Market } from '../model/market'
import { Currency } from '../model/currency'
import { Asset } from '../model/asset'

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
  epoch: string
  startTimestamp: string
  endTimestamp: string
  quoteToken: Currency
  baseToken: Currency
  depths: DepthDto[]
}
export async function fetchMarkets(): Promise<Market[]> {
  const { markets } = await getMarkets()
  return markets.map((market) =>
    Market.fromDto({
      address: getAddress(market.id),
      orderToken: getAddress(market.orderToken),
      takerFee: market.takerFee,
      quoteUnit: market.quoteUnit,
      epoch: market.epoch,
      startTimestamp: market.startTimestamp,
      endTimestamp: market.endTimestamp,
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
  const marketAfterCurrentTimestamp = markets.filter(
    (market) => market.endTimestamp > currentTimestamp,
  )
  return marketAfterCurrentTimestamp
    .map((_, i) => marketAfterCurrentTimestamp.slice(0, i + 1))
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
