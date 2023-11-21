export type Transaction = {
  data: `0x${string}`
  gasLimit: bigint
  value: bigint
  from: `0x${string}`
  to: `0x${string}`
  nonce: number
  gasPrice: bigint
}
