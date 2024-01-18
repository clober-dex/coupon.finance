export async function fetchCouponApi<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `https://coupon-point-api-g3xjgyu3ya-du.a.run.app/${path}`,
    options,
  )

  if (response.ok) {
    return response.json()
  } else {
    const errorResponse = await response.json()

    throw new Error(errorResponse.message || 'Unknown Error')
  }
}

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
