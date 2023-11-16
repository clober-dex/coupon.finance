export function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatShortAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-2)}`
}
