import { Market } from '../api/market'

export const calculateDepositedAmount = (
  orderBook: Market,
  inputTokenAmount: bigint,
  inputTokenUSDPrice: number,
  ignoreMinUsdThreshold: number,
): bigint => {
  let depositedAmount = inputTokenAmount
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const usdValueForInputAmount =
      (Number(inputTokenAmount) / 10 ** orderBook.baseToken.decimals) *
      inputTokenUSDPrice
    if (usdValueForInputAmount < ignoreMinUsdThreshold) {
      break
    }
    const { market: newOrderBook, amountOut } = orderBook.swap(
      orderBook.baseToken.address,
      inputTokenAmount,
    )
    orderBook = newOrderBook
    inputTokenAmount = amountOut
    depositedAmount += amountOut
  }
  return depositedAmount
}
