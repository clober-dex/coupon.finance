import { Prices } from '../model/prices'
import { Currency } from '../model/currency'

export const fetchAmountOutByCouponOracle = async ({
  amountIn,
  inputCurrency,
  outputCurrency,
  prices,
}: {
  amountIn: bigint
  inputCurrency: Currency
  outputCurrency: Currency
  prices: Prices
}): Promise<bigint> => {
  const inputTokenPrice = prices[inputCurrency.address]
    ? prices[inputCurrency.address].value
    : 0n
  const outputTokenPrice = prices[outputCurrency.address]
    ? prices[outputCurrency.address].value
    : 0n
  if (amountIn === 0n || inputTokenPrice === 0n || outputTokenPrice === 0n) {
    return 0n
  }
  return (
    (amountIn *
      inputTokenPrice *
      10n ** (18n - BigInt(inputCurrency.decimals ?? 18))) /
    (outputTokenPrice * 10n ** (18n - BigInt(outputCurrency.decimals ?? 18)))
  )
}
