import { getAddress } from 'viem'

export const WrappedEthers = [
  '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', // polygon
  '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', // arbitrum
  '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', // polygon zkevm
  '0x4284186b053ACdBA28E8B26E99475d891533086a',
].map((x) => getAddress(x))
