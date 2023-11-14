import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const query = req.query
  const { id, chainId } = query
  res.json({
    id,
    name: `Loan #${id}`,
    description: 'Coupon Finance Loan',
    image: `https://coupon.finance/api/nft/chains/${chainId}/loans/${id}/image`,
  })
}
