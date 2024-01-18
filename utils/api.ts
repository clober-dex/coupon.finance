export const COUPON_API_ENDPOINT =
  'https://coupon-point-api-g3xjgyu3ya-du.a.run.app'

export async function fetchCouponApi<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${COUPON_API_ENDPOINT}/${path}`, options)

  if (response.ok) {
    return response.json()
  } else {
    const errorResponse = await response.json()

    throw new Error(errorResponse.message || 'Unknown Error')
  }
}
