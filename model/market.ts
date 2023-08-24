import { Market } from '../api/market'

export const calculateDepositedAmount = (
  market: Market,
  inputTokenAmount: bigint,
  inputTokenUSDPrice: number,
  ignoreMinUsdThreshold: number,
): bigint => {
  let depositedAmount = inputTokenAmount
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const usdValueForInputAmount =
      (Number(inputTokenAmount) / 10 ** market.baseToken.decimals) *
      inputTokenUSDPrice
    if (usdValueForInputAmount < ignoreMinUsdThreshold) {
      break
    }
    const { market: newMarket, amountOut } = market.swap(
      market.baseToken.address,
      inputTokenAmount,
    )
    market = newMarket
    inputTokenAmount = amountOut
    depositedAmount += amountOut
  }
  return depositedAmount
}
