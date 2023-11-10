import { Point } from '../model/point'

export const getCurrentPoint = (points: Point[]): bigint => {
  return points.reduce((acc, point) => {
    const currentTimestamp = Math.floor(new Date().getTime() / 1000)
    return (
      acc +
      point.accumulatedPoint +
      calculatePoint(
        point.amount,
        point.decimals,
        point.price,
        point.priceDecimals,
        BigInt(currentTimestamp) - point.updatedAt,
      )
    )
  }, 0n)
}

export const calculatePoint = (
  amount: bigint,
  amountDecimals: number,
  price: bigint,
  priceDecimals: number,
  periodInSeconds: bigint,
): bigint => {
  return (
    (amount * price * periodInSeconds) /
    3600n /
    10n ** BigInt(amountDecimals + priceDecimals)
  )
}
