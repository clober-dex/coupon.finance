import { getAddress } from 'viem'

import { getBuiltGraphSDK } from '../.graphclient'
import { Currency } from '../utils/currency'

const { DepositAssets } = getBuiltGraphSDK()

export async function fetchDepositAssets(): Promise<Currency[]> {
  const { tokens } = await DepositAssets()

  return tokens.map((token) => ({
    address: getAddress(token.id),
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logo: `/assets/icons/icon-${token.symbol.toLowerCase()}.svg`,
  }))
}
