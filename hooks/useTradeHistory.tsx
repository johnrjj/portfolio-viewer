import { useQuery } from '@tanstack/react-query'
import type { TradeEvent } from '../utils/cost-basis.types'
import type { SupportedAsset } from '../data/historical-trades'

const fetchTradeHistory = async () => {
  const tradeHistoryResponse = await fetch('/api/trade-history')
  const tradeHistoryData: {
    trades: TradeEvent[]
    assets: SupportedAsset[]
  } = await tradeHistoryResponse.json()
  return tradeHistoryData
}

const useTradeHistory = () => {
  const tradeHistoryQuery = useQuery({
    queryFn: () => fetchTradeHistory(),
    queryKey: ['trade-history'],
    enabled: true,
  })
  return tradeHistoryQuery
}

export { useTradeHistory }
