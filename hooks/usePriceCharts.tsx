import { useQuery } from '@tanstack/react-query'
import { getUnixTime, subHours, subYears } from 'date-fns'
import { fetchTimeSeries } from '../utils/price-data/defined'
import type { OHLCTradingViewCompatibleChartData } from '../utils/price-data/defined.types'

export type PriceChartMap = Record<string, OHLCTradingViewCompatibleChartData>

const usePriceCharts = (
  assets: string[] | undefined,
  resolutionTime: '1D' = '1D',
) => {
  return useQuery({
    queryKey: ['historical-pricing', assets, resolutionTime],
    refetchInterval: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const now = subHours(new Date(), 10)
      const nowUnix = getUnixTime(now)
      const yearAgo = subYears(now, 1)
      const yearAgoUnix = getUnixTime(yearAgo)
      const promises = assets!.map((tokenAddress) =>
        fetchTimeSeries({
          address: tokenAddress,
          chainId: '1',
          from: yearAgoUnix,
          to: nowUnix,
          currencyCode: 'USD',
          removeLeadingNullValues: false,
          resolution: resolutionTime,
        }),
      )
      const results = await Promise.all(promises)

      let priceChartMap: PriceChartMap = {}

      results.forEach((r, idx) => {
        const address = assets![idx]
        priceChartMap[address] = r
      })

      return priceChartMap
    },
    enabled: !!assets,
  })
}

export { usePriceCharts }
