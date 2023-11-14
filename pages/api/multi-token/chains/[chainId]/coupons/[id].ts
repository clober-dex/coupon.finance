import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const query = req.query
  const { id } = query
  res.json({
    name: `Coupon ${id}`,
    description: 'Coupon Finance base URI',
    image: '',
    external_link: 'https://coupon.finance/',
  })
}
