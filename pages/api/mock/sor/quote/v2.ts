import { NextApiRequest, NextApiResponse } from 'next'
import { getAddress } from 'viem'
import { readContracts } from '@wagmi/core'
import { ethers } from 'ethers'

import { CONTRACT_ADDRESSES } from '../../../../../utils/addresses'
import { CouponOracle__factory, ERC20__factory } from '../../../../../typechain'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    const {
      chainId,
      inputTokens,
      outputTokens,
    }: {
      chainId: number
      inputTokens: {
        tokenAddress: `0x${string}`
        amount: string
      }[]
      outputTokens: {
        tokenAddress: `0x${string}`
        proportion: number
      }[]
    } = req.body

    const [
      { result: prices },
      { result: inputTokenDecimals },
      { result: outputTokenDecimals },
    ] = await readContracts({
      contracts: [
        {
          address: CONTRACT_ADDRESSES.CouponOracle,
          abi: CouponOracle__factory.abi,
          functionName: 'getAssetsPrices',
          args: [[inputTokens[0].tokenAddress, outputTokens[0].tokenAddress]],
          chainId,
        },
        {
          address: getAddress(inputTokens[0].tokenAddress),
          abi: ERC20__factory.abi,
          functionName: 'decimals',
          chainId,
        },
        {
          address: getAddress(outputTokens[0].tokenAddress),
          abi: ERC20__factory.abi,
          functionName: 'decimals',
          chainId,
        },
      ],
    })

    const inputAmount = BigInt(inputTokens[0].amount)
    const outputAmount =
      (inputAmount *
        BigInt(prices?.[0] ?? 1n) *
        10n ** (18n - BigInt(inputTokenDecimals ?? 18n))) /
      (BigInt(prices?.[1] ?? 1n) *
        10n ** (18n - BigInt(outputTokenDecimals ?? 18n)))

    const iface = new ethers.utils.Interface([
      'function swap(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut) external',
    ])
    const pathId = iface.encodeFunctionData('swap', [
      inputTokens[0].tokenAddress,
      outputTokens[0].tokenAddress,
      inputTokens[0].amount,
      outputAmount.toString(),
    ])

    return res.json({
      inTokens: [inputTokens[0].tokenAddress],
      outTokens: [outputTokens[0].tokenAddress],
      inAmounts: [inputTokens[0].amount],
      outAmounts: [outputAmount.toString()],
      pathId,
    })
  } catch (e) {
    return res.json({
      inTokens: [],
      outTokens: [],
      inAmounts: ['0'],
      outAmounts: ['0'],
      pathId: '',
    })
  }
}
