import { promises as fs } from 'fs'
import path from 'path'

import type { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig()

import { fetchPrices } from '../../../../apis/currency'
import { formatUnits } from '../../../../utils/numbers'
import { fetchBondPosition } from '../../../../apis/bond-position'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    const query = req.query
    const { positionId, chainId } = query
    if (
      !positionId ||
      !chainId ||
      typeof positionId !== 'string' ||
      typeof chainId !== 'string'
    ) {
      res.json({
        status: 'error',
        message: 'URL should be /api/nft/bond/[positionId]?chainId=[chainId]',
      })
      return
    }
    const bondPosition = await fetchBondPosition(
      Number(chainId),
      BigInt(positionId),
    )
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
    const expiresAt = new Date(Number(bondPosition.toEpoch.endTimestamp) * 1000)
      .toISOString()
      .slice(2, 10)
      .replace(/-/g, '-')

    const baseSvg = (
      await fs.readFile(
        path.join(
          serverRuntimeConfig.PROJECT_ROOT,
          './public/bond-position-nft.svg',
        ),
      )
    ).toString()

    const svg = baseSvg
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
      message: 'Something went wrong, please try again!!!',
    })
  }
}
