import { fetchCouponApi } from '../utils/api'

export async function fetchReferralCode(address: `0x${string}`) {
  return (
    await fetchCouponApi<{
      code: string | null
    }>(`referrals/codes/${address}`)
  ).code
}

export async function fetchReferentCode(address: `0x${string}`) {
  return (
    await fetchCouponApi<{
      code: string | null
    }>(`referrals/referents/${address}`)
  ).code
}

export async function setReferralCode(address: `0x${string}`) {
  return (
    await fetchCouponApi<{
      code: string | null
    }>(`referrals/codes/${address}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
    })
  ).code
}

export async function getReferralList(address: `0x${string}`) {
  return (
    await fetchCouponApi<{
      referrals: {
        address: `0x${string}`
        referralPoint: number
      }[]
    }>(`referrals/${address}`)
  ).referrals
}

export async function setReferentCodeWithSignature(
  address: `0x${string}`,
  code: string,
  signature: `0x${string}`,
) {
  return (
    await fetchCouponApi<{
      code: string | null
    }>(`referrals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        id: address,
        code,
        signature,
      }),
    })
  ).code
}
