export type Currency = {
  address: `0x${string}`
  name: string
  symbol: string
  decimals: number
}

export function getLogo(currency?: Currency): string {
  if (!currency) {
    return ''
  }
  return `/assets/icons/icon-${currency.symbol.toLowerCase()}.svg`
}
