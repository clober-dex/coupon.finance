export async function fetchOdosApi<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const ODOS_API_BASE_URL =
    process.env.NEXT_PUBLIC_ODOS_API_BASE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    (process.env.BUILD === 'dev'
      ? 'http://localhost:3000/api/mock'
      : 'https://api.odos.xyz')
  const response = await fetch(`${ODOS_API_BASE_URL}/${path}`, options)

  if (response.ok) {
    return response.json()
  } else {
    const errorResponse = await response.json()

    throw new Error(errorResponse.message || 'Unknown Error')
  }
}

export async function fetchCallDataByOdos({
  pathId,
  userAddress,
}: {
  pathId: string
  userAddress: string
}): Promise<`0x${string}`> {
  const { transaction } = await fetchOdosApi<{
    transaction: {
      data: `0x${string}`
    }
  }>('sor/assemble', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      pathId,
      simulate: true,
      userAddr: userAddress,
    }),
  })
  return transaction.data
}

export async function fetchAmountOutByOdos({
  chainId,
  amountIn,
  tokenIn,
  tokenOut,
  slippageLimitPercent,
  userAddress,
  gasPrice,
}: {
  chainId: number
  amountIn: string
  tokenIn: string
  tokenOut: string
  slippageLimitPercent: number
  userAddress: string
  gasPrice: number
}): Promise<{
  amountOut: bigint
  pathId: string
}> {
  const result: {
    outAmounts: string[]
    pathId: string
  } = await fetchOdosApi('sor/quote/v2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      chainId,
      inputTokens: [
        {
          tokenAddress: tokenIn,
          amount: amountIn,
        },
      ],
      outputTokens: [
        {
          tokenAddress: tokenOut,
          proportion: 1,
        },
      ],
      gasPrice: gasPrice / 1e9,
      userAddr: userAddress,
      slippageLimitPercent,
      sourceBlacklist: [],
      pathViz: false,
    }),
  })
  return {
    amountOut: BigInt(result.outAmounts[0]),
    pathId: result.pathId,
  }
}
