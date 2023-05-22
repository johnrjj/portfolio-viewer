import { useQuery } from '@tanstack/react-query'
import { fetchUsdPrices } from '../utils/price-data/defined'
import type { Price } from '../utils/price-data/defined.types'

export type PriceMap = Record<string, Price>

const usePrices = (assets: string[] | undefined) => {
  return useQuery({
    queryKey: ['usd-asset-prices', assets],
    refetchInterval: 60 * 1000, // Refresh realtime prices every minute by default
    queryFn: async () => {
      const args = assets!.map((tokenAddress) => {
        return {
          address: tokenAddress,
          networkId: 1,
        }
      })
      const pricesResult = await fetchUsdPrices(args)
      let priceMap: PriceMap = {}
      pricesResult.forEach((result) => {
        priceMap[result.address] = result
      })
      return priceMap
    },
    enabled: !!assets,
  })
}

export { usePrices }
