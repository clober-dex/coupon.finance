import type { NextApiRequest, NextApiResponse } from 'next'
import { formatDate } from '@storybook/blocks'

import { fetchBondPosition } from '../../../../../../../apis/bond-position'
import { fetchPrices } from '../../../../../../../apis/currency'
import { formatUnits } from '../../../../../../../utils/numbers'

import bondSvg from './bond-svg'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    const query = req.query
    const { id, chainId } = query

    if (
      !id ||
      !chainId ||
      typeof id !== 'string' ||
      typeof chainId !== 'string'
    ) {
      res.json({
        status: 'error',
        message: 'URL should be /api/nft/chains/[chainId]/bonds/[id]',
      })
      return
    }
    const bondPosition = await fetchBondPosition(Number(chainId), BigInt(id))
    if (!bondPosition) {
      res.json({
        status: 'error',
        message: 'Something went wrong, while fetching bond position',
      })
      return
    }
    const prices = await fetchPrices(Number(chainId), [
      bondPosition.underlying.address,
    ])
    const expiresAt = formatDate(
      new Date(Number(bondPosition.toEpoch.endTimestamp) * 1000),
    )
    const svg = bondSvg
      .replace(
        /DEPOSIT_AMOUNT/g,
        formatUnits(
          bondPosition.amount,
          bondPosition.underlying.decimals,
          prices[bondPosition.underlying.address],
        ),
      )
      .replace(/DEPOSIT_TOKEN/g, bondPosition.underlying.symbol)
      .replace(/EXPIRES_AT/g, expiresAt)

    res
      .writeHead(200, {
        'Content-Type': 'image/svg+xml',
      })
      .end(svg)
  } catch (error) {
    res.json({
      status: 'error',
      message: `Something went wrong, please try again!!!: ${error}`,
    })
  }
}
