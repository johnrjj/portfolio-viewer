import { NextApiRequest, NextApiResponse } from 'next'
import { SAMPLE_ASSETS, SAMPLE_TRADES } from '../../data/historical-trades'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    trades: SAMPLE_TRADES,
    assetsMetadata: SAMPLE_ASSETS,
  })
}
