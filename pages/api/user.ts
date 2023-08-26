import { NextApiRequest, NextApiResponse } from 'next'

let cache: {
  userAddress: `0x${string}` | undefined
  balance: string | undefined
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    cache = req.body
    res
      .status(200)
      .json({ message: 'Data received and processed successfully.' })
  } else {
    res.status(200).json(cache || {})
  }
}
