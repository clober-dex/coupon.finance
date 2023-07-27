export async function fetchGraphQL<T>({
  endpoint,
  query,
}: {
  endpoint: string
  query: string
}): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  if (response.ok) {
    const { data } = await response.json()
    return data
  } else {
    const errorResponse = await response.json()

    throw new Error(errorResponse.message || 'Unknown Error')
  }
}
