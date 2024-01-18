import { fetchCouponApi } from '../utils/api'
import { Point } from '../model/point'

export async function fetchPoints(address: `0x${string}`) {
  return fetchCouponApi<Point>(`points/${address}`)
}
