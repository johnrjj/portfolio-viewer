import { expect, it, describe } from 'vitest'
import { createAssetFromTrades } from './asset'
import {
  deriveCostBasisData,
  deriveRealizedPnL,
  deriveUnrealizedPnL,
  deriveRemainingUnits,
} from './cost-basis'

const BUY_1 = {
  amount: 2, // total (spent 2 USD in total)
  asset: 'BTC',
  buyDate: 123,
  type: 'BUY',
  unitsBought: 4, // bought 4 bitcoins
  unitPrice: 2 / 4, // bought 4 bitcoins for 2$ means 0.5 each (unit price)
} as const

const BUY_2 = {
  amount: 8,
  asset: 'BTC',
  buyDate: 123,
  type: 'BUY',
  unitsBought: 10,
  unitPrice: 8 / 10,
} as const

const SELL_1 = {
  amount: 12,
  asset: 'BTC',
  sellDate: 124,
  type: 'SELL',
  unitsSold: 6,
  unitPrice: 12 / 6,
} as const

const SELL_2 = {
  amount: 1,
  asset: 'BTC',
  sellDate: 124,
  type: 'SELL',
  unitsSold: 4,
  unitPrice: 1 / 4,
} as const

const BUY_3 = {
  amount: 10,
  asset: 'BTC',
  buyDate: 125,
  type: 'BUY',
  unitsBought: 8,
  unitPrice: 10 / 8,
} as const

describe('asset cost basis calcs', () => {
  it('calcs 1 buy', () => {
    let asset = createAssetFromTrades('BTC', [BUY_1])
    const assetCostBasisData = deriveCostBasisData(asset.buys, asset.sells)
    const remainingUnits = deriveRemainingUnits(asset.buys, asset.sells)

    expect(remainingUnits).toBe(BUY_1.unitsBought)
    expect(assetCostBasisData.gainLoss.length).toBe(0)
  })

  it('calcs 2 buys', () => {
    const asset = createAssetFromTrades('BTC', [BUY_1, BUY_2])
    const assetCostBasisData = deriveCostBasisData(asset.buys, asset.sells)
    const remainingUnits = deriveRemainingUnits(asset.buys, asset.sells)
    expect(remainingUnits).toBe(BUY_1.unitsBought + BUY_2.unitsBought)
    expect(assetCostBasisData.gainLoss.length).toBe(0)
  })

  it('calcs 2 buys and a sell', () => {
    const asset = createAssetFromTrades('BTC', [BUY_1, BUY_2, SELL_1])
    const assetCostBasisData = deriveCostBasisData(asset.buys, asset.sells)
    const remainingUnits = deriveRemainingUnits(asset.buys, asset.sells)
    expect(remainingUnits).toBe(
      BUY_1.unitsBought + BUY_2.unitsBought - SELL_1.unitsSold,
    )

    expect(assetCostBasisData.gainLoss.length).toBe(2)
    expect(assetCostBasisData.gainLoss[0].amount).toBe(6)
    expect(assetCostBasisData.gainLoss[1].amount).toBe(2.4)
  })

  it('calcs 2 buys and 2 sells', () => {
    const asset = createAssetFromTrades('BTC', [BUY_1, BUY_2, SELL_1, SELL_2])
    const assetCostBasisData = deriveCostBasisData(asset.buys, asset.sells)
    const remainingUnits = deriveRemainingUnits(asset.buys, asset.sells)
    expect(remainingUnits).toBe(
      BUY_1.unitsBought +
        BUY_2.unitsBought -
        SELL_1.unitsSold -
        SELL_2.unitsSold,
    )

    expect(assetCostBasisData.gainLoss.length).toBe(3)
    expect(assetCostBasisData.gainLoss[0].amount).toBe(6)
    expect(assetCostBasisData.gainLoss[1].amount).toBe(2.4)
    expect(assetCostBasisData.gainLoss[2].amount).toBe(-2.2)
    expect(assetCostBasisData.remainingBuys.length).toBe(1)
    expect(assetCostBasisData.remainingBuys[0].unitsBought).toBe(4)
    expect(assetCostBasisData.remainingBuys[0].unitPrice).toBe(BUY_2.unitPrice)
    expect(assetCostBasisData.remainingBuys[0].amount).toBe(4 * BUY_2.unitPrice)
    expect(deriveUnrealizedPnL(assetCostBasisData.remainingBuys, 2)).toBe(4.8)
    expect(deriveRealizedPnL(assetCostBasisData.gainLoss)).toBe(6.2)
  })

  it('calcs 2 buys then 2 sells then a buy', () => {
    const asset = createAssetFromTrades('BTC', [
      BUY_1,
      BUY_2,
      SELL_1,
      SELL_2,
      BUY_3,
    ])
    const assetCostBasisData = deriveCostBasisData(asset.buys, asset.sells)
    const remainingUnits = deriveRemainingUnits(asset.buys, asset.sells)

    expect(remainingUnits).toBe(
      BUY_1.unitsBought +
        BUY_2.unitsBought -
        SELL_1.unitsSold -
        SELL_2.unitsSold +
        BUY_3.unitsBought,
    )
    expect(assetCostBasisData.gainLoss.length).toBe(3)
    expect(assetCostBasisData.gainLoss[0].amount).toBe(6)
    expect(assetCostBasisData.gainLoss[1].amount).toBe(2.4)
    expect(assetCostBasisData.gainLoss[2].amount).toBe(-2.2)
    expect(assetCostBasisData.remainingBuys.length).toBe(2)
    expect(assetCostBasisData.remainingBuys[0].unitsBought).toBe(4)
    expect(assetCostBasisData.remainingBuys[0].unitPrice).toBe(BUY_2.unitPrice)
    expect(assetCostBasisData.remainingBuys[0].amount).toBe(4 * BUY_2.unitPrice)
    expect(assetCostBasisData.remainingBuys[1].unitsBought).toBe(
      BUY_3.unitsBought,
    )
    expect(assetCostBasisData.remainingBuys[1].unitPrice).toBe(BUY_3.unitPrice)
    expect(assetCostBasisData.remainingBuys[1].amount).toBe(BUY_3.amount)
    expect(deriveUnrealizedPnL(assetCostBasisData.remainingBuys, 2)).toBe(10.8)
    expect(deriveRealizedPnL(assetCostBasisData.gainLoss)).toBe(6.2)
  })
})
