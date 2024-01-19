import { fetchCouponApi } from '../utils/api'
import { Leaderboard, Point } from '../model/point'

export async function fetchPoints(address: `0x${string}`) {
  return fetchCouponApi<Point>(`points/${address}`)
}

export async function fetchLeaderboard(address: `0x${string}`) {
  return fetchCouponApi<Leaderboard>(`points/${address}/rankings`)
}
