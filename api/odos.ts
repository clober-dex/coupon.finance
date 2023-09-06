import { fetchOdosApi } from '../utils/odos'

export async function fetchExpectedAmountOutByOdos({
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
}): Promise<bigint> {
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
  return BigInt(result.outAmounts[0])
}
