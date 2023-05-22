import { useMemo } from 'react'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import { createAssetFromTrades } from '../utils/asset'
import type { TradeEvent } from '../utils/cost-basis.types'

const useAssets = (tradeEvents: TradeEvent[] | undefined) => {
  const sortedTrades = useMemo(() => {
    return sortBy(tradeEvents, (e) => {
      switch (e.type) {
        case 'BUY':
          return e.buyDate
        case 'SELL':
          return e.sellDate
        default:
          throw new Error(`Unknown type: ${(e as TradeEvent).type}`)
      }
    })
  }, [tradeEvents])

  const tradesGroupedByAsset = useMemo(() => {
    return groupBy(
      sortBy(tradeEvents, (e) => {
        switch (e.type) {
          case 'BUY':
            return e.buyDate
          case 'SELL':
            return e.sellDate
          default:
            throw new Error(`Unknown type: ${(e as TradeEvent).type}`)
        }
      }),
      (e) => e.asset,
    )
  }, [tradeEvents])

  const assets = useMemo(() => {
    const assetIds = Object.keys(tradesGroupedByAsset)
    return assetIds.map((assetId) => {
      const tradesForAsset = tradesGroupedByAsset[assetId]
      const asset = createAssetFromTrades(assetId, tradesForAsset)
      return asset
    })
  }, [tradesGroupedByAsset])

  return {
    tradesSortedByRecency: sortedTrades,
    tradesGroupedByAsset: tradesGroupedByAsset,
    assets,
  }
}

export { useAssets }
