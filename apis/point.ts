import { getBuiltGraphSDK } from '../.graphclient'
import { POINT_SUBGRAPH_URL } from '../constants/subgraph-url'
import { CHAIN_IDS } from '../constants/chain'
import { Point } from '../model/point'

const { getBondPositionPoints, getLoanPositionPoints } = getBuiltGraphSDK()

export async function fetchPoints(
  chainId: CHAIN_IDS,
  userAddress: `0x${string}`,
): Promise<Point[]> {
  const { bondPositionPoints } = await getBondPositionPoints(
    {
      userAddress: userAddress.toLowerCase(),
    },
    {
      url: POINT_SUBGRAPH_URL[chainId],
    },
  )
  const { loanPositionPoints } = await getLoanPositionPoints(
    {
      userAddress: userAddress.toLowerCase(),
    },
    {
      url: POINT_SUBGRAPH_URL[chainId],
    },
  )
  return [
    ...bondPositionPoints.map((point) => ({
      amount: BigInt(point.amount),
      decimals: Number(point.decimals),
      price: BigInt(point.price),
      priceDecimals: Number(point.priceDecimals),
      accumulatedPoint: BigInt(point.accumulatedPoint),
      updatedAt: BigInt(point.updatedAt),
    })),
    ...loanPositionPoints.map((point) => ({
      amount: BigInt(point.collateralAmount),
      decimals: Number(point.collateralDecimals),
      price: BigInt(point.collateralPrice),
      priceDecimals: Number(point.collateralPriceDecimals),
      accumulatedPoint: BigInt(point.accumulatedPoint),
      updatedAt: BigInt(point.updatedAt),
    })),
  ]
}
