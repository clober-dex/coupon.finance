import { fetchCouponApi } from '../utils/api'
import { DragonPoint, Leaderboard, Point } from '../model/point'

export async function fetchPoints(address: `0x${string}`) {
  return fetchCouponApi<Point>(`points/${address}`)
}

export async function fetchDragonPoints(address: `0x${string}`) {
  return fetchCouponApi<DragonPoint>(`dragons/${address}`)
}

export async function fetchLeaderboard(address: `0x${string}`) {
  return fetchCouponApi<Leaderboard>(`points/${address}/rankings`)
}

export async function claimDragonPoint(address: `0x${string}`) {
  return (
    await fetchCouponApi<{
      claimed: boolean
    }>(`dragons/${address}/claim`, {
      method: 'POST',
    })
  ).claimed
}
