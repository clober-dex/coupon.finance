import { promises as fs } from 'fs'

import type { NextApiRequest, NextApiResponse } from 'next'

import { getBuiltGraphSDK } from '../../../../.graphclient'
import { fetchPrices } from '../../../../apis/currency'
import { toCurrency } from '../../../../apis/asset'
import { formatUnits } from '../../../../utils/numbers'

const { getBondPosition } = getBuiltGraphSDK()

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
    const { bondPosition } = await getBondPosition(
      {
        positionId: positionId,
      },
      {
        url: process.env.SUBGRAPH_URL,
      },
    )
    if (!bondPosition) {
      res.json({
        status: 'error',
        message: 'Something went wrong, please try again!!!',
      })
      return
    }
    const bondAmount = BigInt(bondPosition.amount)
    const bondToken = toCurrency(bondPosition.underlying)
    const prices = await fetchPrices([bondToken.address])
    const expiresAt = new Date(Number(bondPosition.toEpoch.endTimestamp) * 1000)
      .toISOString()
      .slice(2, 10)
      .replace(/-/g, '-')

    const baseSvg = (
      await fs.readFile('public/position-nft-deposit.svg')
    ).toString()

    const svg = baseSvg
      .replace(
        /DEPOSIT_AMOUNT/g,
        formatUnits(bondAmount, bondToken.decimals, prices[bondToken.address]),
      )
      .replace(/DEPOSIT_TOKEN/g, bondToken.symbol)
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
