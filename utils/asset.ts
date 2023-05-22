import type { TradeEvent, BuyEvent, SellEvent } from './cost-basis.types'

// An asset is a token or stock that includes a user's buy and sell history.
// The buy and sell history is used to derive cost basis, PnL, and return estimates.
export interface Asset {
  buys: BuyEvent[]
  sells: SellEvent[]
  assetId: string
}

export const createAssetFromTrades = (
  assetId: string,
  trades: TradeEvent[],
): Asset => {
  const buys: BuyEvent[] = []
  const sells: SellEvent[] = []
  trades.forEach((tradeEvent) => {
    switch (tradeEvent.type) {
      case 'BUY':
        buys.push(tradeEvent)
        break
      case 'SELL':
        sells.push(tradeEvent)
        break
      default:
        throw new Error(
          `Unknown trade type: ${(tradeEvent as TradeEvent).type}`,
        )
    }
  })
  return {
    assetId: assetId,
    buys,
    sells,
  }
}
