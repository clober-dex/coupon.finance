import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const query = req.query
  const { positionId, chainId } = query
  res.json({
    id: positionId,
    name: `Loan #${positionId}`,
    description: 'Coupon Finance Loan',
    image: `https://coupon.finance/api/nft/loan/${chainId}/images/${positionId}`,
  })
}
