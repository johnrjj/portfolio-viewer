import orderBy from 'lodash/orderBy'
import type { BuyEvent, SellEvent, GainLoss } from './cost-basis.types'

const deriveCostBasis = (
  buys: BuyEvent[],
  sells: SellEvent[],
  throwOnUnknownCostBasis: boolean = false,
) => {
  const remainingBuyAmounts: WeakMap<BuyEvent, number> = new WeakMap()
  buys.forEach((buy) => remainingBuyAmounts.set(buy, buy.unitsBought))

  const sortedBuysFIFO = orderBy(buys, (buy) => buy.buyDate, 'asc')
  const sortedSellsFIFO = orderBy(sells, (sell) => sell.sellDate, 'asc')

  const gainLossEvents: GainLoss[] = []

  sortedSellsFIFO.forEach((sell) => {
    let remainingSellAmount = sell.unitsSold
    // FIFO
    for (let i = 0; i < sortedBuysFIFO.length; i++) {
      const buy = sortedBuysFIFO[i]
      const remainingBuyAmount = remainingBuyAmounts.get(buy)!

      if (remainingBuyAmount === 0) {
        continue
      }
      // Buys after the sells don't count towards cost basis of this sell
      if (buy.buyDate > sell.sellDate) {
        continue
      }

      // Has enough
      if (remainingBuyAmount > remainingSellAmount) {
        const newRemainingBuyAmount = remainingBuyAmount - remainingSellAmount
        remainingBuyAmounts.set(buy, newRemainingBuyAmount)
        const amount = remainingSellAmount * (sell.unitPrice - buy.unitPrice)

        const gainLoss: GainLoss = {
          amount: amount,
          capGains: 'SHORT',
          sellDate: sell.sellDate,
          buyDate: buy.buyDate,
          unitsSold: remainingSellAmount,
          buyUnitPrice: buy.unitPrice,
          sellUnitPrice: sell.unitPrice,
        }
        remainingSellAmount = 0
        gainLossEvents.push(gainLoss)
        break
      } else {
        // does not have enough
        const newRemainingSellAmount = remainingSellAmount - remainingBuyAmount
        remainingSellAmount = newRemainingSellAmount
        remainingBuyAmounts.set(buy, 0)
        const amount = remainingBuyAmount * (sell.unitPrice - buy.unitPrice)

        const gainLoss: GainLoss = {
          amount: amount,
          capGains: 'SHORT',
          sellDate: sell.sellDate,
          buyDate: buy.buyDate,
          unitsSold: remainingBuyAmount,
          buyUnitPrice: buy.unitPrice,
          sellUnitPrice: sell.unitPrice,
        }
        gainLossEvents.push(gainLoss)
      }
    }

    if (remainingSellAmount > 0.0000001) {
      // Unknown corresponding buy event, set cost basis to 0
      const amount = remainingSellAmount * (sell.unitPrice - 0)
      const gainLoss: GainLoss = {
        amount: amount,
        capGains: 'SHORT',
        sellDate: sell.sellDate,
        buyDate: 0,
        unitsSold: remainingSellAmount,
        buyUnitPrice: 0,
        sellUnitPrice: sell.unitPrice,
      }
      remainingSellAmount = 0
      gainLossEvents.push(gainLoss)
      if (throwOnUnknownCostBasis) {
        throw new Error(
          `${sell.asset}: Cost basis 0 found, remaining unknown amount: ${remainingSellAmount}`,
        )
      }
    }
  })

  // Compute remaining positions for asset so we can cache + show to user
  let remainingBuys: BuyEvent[] = []
  sortedBuysFIFO.forEach((buy) => {
    const remainingBuyAmount = remainingBuyAmounts.get(buy)!
    if (remainingBuyAmount === 0) {
      return
    }
    const buyEventWithRemainingAmount: BuyEvent = {
      ...buy,
      unitsBought: remainingBuyAmount,
      amount: remainingBuyAmount * buy.unitPrice,
    }
    remainingBuys.push(buyEventWithRemainingAmount)
  })

  return {
    gainLossEvents,
    remainingBuys,
  }
}

const deriveRemainingUnits = (buys: BuyEvent[], sells: SellEvent[]) => {
  let remaining = 0

  buys.forEach((buy) => (remaining = remaining + buy.unitsBought))
  sells.forEach((sell) => (remaining = remaining - sell.unitsSold))

  return remaining
}

const deriveRealizedPnL = (gainLossEvents: GainLoss[]): number => {
  return gainLossEvents.reduce((accum, cur) => {
    return accum + cur.amount
  }, 0)
}

const deriveUnrealizedPnL = (
  remainingBuys: BuyEvent[],
  curPriceOfAssetInUsd: number,
): number => {
  return remainingBuys.reduce((accum, cur) => {
    // cost now - what it cost to buy
    const currentProfitOrLoss =
      cur.unitsBought * curPriceOfAssetInUsd - cur.amount
    return accum + currentProfitOrLoss
  }, 0)
}

const deriveCostBasisData = (buys: BuyEvent[], sells: SellEvent[]) => {
  const costBasisData = deriveCostBasis(buys, sells)
  const gainLoss = costBasisData.gainLossEvents
  const remainingBuys = costBasisData.remainingBuys
  return {
    gainLoss,
    remainingBuys,
  }
}

export {
  deriveCostBasis,
  deriveRemainingUnits,
  deriveRealizedPnL,
  deriveUnrealizedPnL,
  deriveCostBasisData,
}
