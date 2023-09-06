export async function fetchOdosApi<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ODOS_API_BASE_URL}/${path}`,
    options,
  )

  if (response.ok) {
    return response.json()
  } else {
    const errorResponse = await response.json()

    throw new Error(errorResponse.message || 'Unknown Error')
  }
}
