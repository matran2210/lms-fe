import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const resp = await axios.get('https://jsonplaceholder.typicode.com/posts/1')

      return res.status(200).json({
        message: 'Hello from Next.js API route!',
        external: resp.data,
      })
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }
  return res.status(405).json({ error: 'Method not allowed' })
}
