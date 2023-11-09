import BigNumber from 'bignumber.js'
import { Chain } from 'wagmi'

import { Currency } from '../model/currency'
import { isEther } from '../contexts/currency-context'

import { BigDecimal, dollarValue } from './numbers'

export const ethValue = (
  chain: Chain,
  ethPrice: BigDecimal,
  inputCurrency: Currency | undefined,
  inputAmount: bigint,
  inputPrice: BigDecimal,
): BigNumber => {
  if (!inputCurrency || !inputAmount) {
    return new BigNumber(0)
  }
  if (isEther(inputCurrency)) {
    return new BigNumber(inputAmount.toString()).div(
      10 ** inputCurrency.decimals,
    )
  }
  return dollarValue(inputAmount, inputCurrency.decimals, inputPrice).div(
    dollarValue(
      10n ** BigInt(chain.nativeCurrency.decimals),
      chain.nativeCurrency.decimals,
      ethPrice,
    ),
  )
}
