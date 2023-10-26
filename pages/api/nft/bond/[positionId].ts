import { promises as fs } from 'fs'

import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchPrices } from '../../../../apis/currency'
import { formatUnits } from '../../../../utils/numbers'
import { fetchBondPosition } from '../../../../apis/bond-position'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    const query = req.query
    const { positionId } = query
    if (!positionId || typeof positionId !== 'string') {
      res.json({
        status: 'error',
        message: 'Something went wrong, please try again!!!',
      })
      return
    }
    const bondPosition = await fetchBondPosition(BigInt(positionId))
    if (!bondPosition) {
      res.json({
        status: 'error',
        message: 'Something went wrong, please try again!!!',
      })
      return
    }
    const prices = await fetchPrices([bondPosition.underlying.address])
    const expiresAt = new Date(Number(bondPosition.toEpoch.endTimestamp) * 1000)
      .toISOString()
      .slice(2, 10)
      .replace(/-/g, '-')

    const baseSvg = (
      await fs.readFile('public/bond-position-nft.svg')
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
    console.log(error)
    res.json({
      status: 'error',
      message: 'Something went wrong, please try again!!!',
    })
  }
}
