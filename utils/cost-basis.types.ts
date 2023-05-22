export interface GainLoss {
  // Gain or loss usd amount. If positive, gain; if negative, loss.
  amount: number
  capGains: 'SHORT' | 'LONG'
  sellDate: number
  buyDate: number
  unitsSold: number
  buyUnitPrice: number
  sellUnitPrice: number
}

export interface SellEvent {
  type: 'SELL'
  // Asset symbol
  asset: string
  // unix timestamp
  sellDate: number
  // Total usd amount (unitsSold * unitPrice [in usd])
  amount: number
  unitsSold: number
  unitPrice: number // amount/units
}

export interface BuyEvent {
  type: 'BUY'
  // Asset symbol
  asset: string
  // unix timestamp
  buyDate: number
  amount: number
  unitsBought: number
  unitPrice: number
}

export type TradeEvent = SellEvent | BuyEvent
