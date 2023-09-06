import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const {
    pathId,
  }: {
    pathId: string
  } = req.body
  return res.json({
    transaction: {
      data: pathId,
    },
  })
}
