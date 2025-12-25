import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  ping: any
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  res.status(200).json({
    ping: 'pong',
  })
}
