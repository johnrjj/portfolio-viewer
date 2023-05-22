import last from 'lodash/last'
import orderBy from 'lodash/orderBy'
import {
  deriveCostBasisData,
  deriveRealizedPnL,
  deriveUnrealizedPnL,
  deriveRemainingUnits,
} from '../utils/cost-basis'
import type { SupportedAsset } from '../data/historical-trades'
import type { PriceChartMap } from './usePriceCharts'
import type { PriceMap } from './usePrices'
import type { PieChartDatum } from '../components/charts/PieChart'
import type { Asset } from '../utils/asset'
import type { AreaChartDatum } from '../components/charts/AreaChart'

/**
 * Derives view layer data from user trades and asset pricing data
 * This of this as a headless data hook. Precomputes frequently viewed/used data
 * All data returned is derived from the input sources of truth (see fn arguments)
 *
 * @param assets User's portfolio assets with trade history data
 * @param assetsMetadata Metadata about the assets (no user data)
 * @param prices Current USD prices of assets
 * @param priceChartMap OHLC chart data over a range of time (defaults to 1yr with 1 day ticks (365 data points))
 * @returns Derived financial data to put on the view layer
 */
const usePortfolioDerivedData = (
  assets: Asset[] | undefined,
  assetsMetadata: SupportedAsset[] | undefined,
  prices: PriceMap | undefined,
  priceChartMap: PriceChartMap | undefined,
) => {
  if (!assets) {
    return
  }
  if (!assetsMetadata) {
    return
  }
  if (!prices) {
    return
  }
  if (!priceChartMap) {
    return
  }

  // Let's precompute a bunch of commonly needed data for each asset
  const assetsWithPrecomputedData = assets.map((asset) => {
    const remainingUnits = deriveRemainingUnits(asset.buys, asset.sells)
    const { gainLoss, remainingBuys } = deriveCostBasisData(
      asset.buys,
      asset.sells,
    )

    const assetMetadata = assetsMetadata.find((x) => x.symbol === asset.assetId)
    const address = assetMetadata!.address
    const currentUsdPriceOfAsset = prices[address].priceUsd

    const priceChartForAsset = priceChartMap[address]

    const lastKnownClosePrice = last(priceChartForAsset.c)
    const lastKnownClosePriceTime = last(priceChartForAsset.t)

    // Daily % change of asset from last close (does not factor in cost baiss)
    const dailyPercentChangeOfAsset = getPercentageChange(
      lastKnownClosePrice!,
      currentUsdPriceOfAsset,
    )

    const closePricesForAsset = priceChartForAsset.c
    const assetPortfolioValuePriceChartTimestampData = priceChartForAsset.t

    const assetPortfolioValuePriceChartCloseData = closePricesForAsset.map(
      (price, _idx) => {
        // const timestamp = priceChartForAsset.t[idx]
        return price * remainingUnits
      },
    )

    const usdValueOfAssetPosition = remainingUnits * currentUsdPriceOfAsset

    const realizedPnL = deriveRealizedPnL(gainLoss)
    const unrealizedPnL = deriveUnrealizedPnL(
      remainingBuys,
      currentUsdPriceOfAsset,
    )

    const dailyReturnUsd =
      usdValueOfAssetPosition - lastKnownClosePrice! * remainingUnits

    const remaininingUnitsBought = remainingBuys.reduce((accum, cur) => {
      return accum + cur.unitsBought
    }, 0)
    const remainingTotalAmountsSpendToAcquire = remainingBuys.reduce(
      (accum, cur) => {
        return accum + cur.amount
      },
      0,
    )
    const averageEntryPriceOfRemainingBuys =
      remainingTotalAmountsSpendToAcquire / remaininingUnitsBought

    const assetTotalCostToAcquireLifetimeUsdCost = asset.buys.reduce(
      (accum, cur) => {
        return accum + cur.amount
      },
      0,
    )

    const assetData = {
      ...assetMetadata!,
      symbol: asset.assetId,
      assetPortfolioValuePriceChartCloseData,
      assetPortfolioValuePriceChartTimestampData,
      price: currentUsdPriceOfAsset,
      usdValueOfAssetPosition,
      realizedPnL,
      unrealizedPnL,
      dailyReturnUsd,
      dailyReturnPercent: dailyPercentChangeOfAsset,
      availableBalance: remainingUnits,
      averageEntryPriceOfRemainingBuys: averageEntryPriceOfRemainingBuys,
      totalCostToAcquireInUsd: assetTotalCostToAcquireLifetimeUsdCost,
    }

    return assetData
  })

  const assetsWithPrecomputedDataBySize = orderBy(
    assetsWithPrecomputedData,
    (asset) => asset.usdValueOfAssetPosition,
    'desc',
  )

  // Then after computing numbers for each asset, derive portfolio-level numbers (aggregated across assets)
  const portfolioRealizedPnL = assetsWithPrecomputedDataBySize.reduce(
    (accum, cur) => {
      return accum + cur.realizedPnL
    },
    0,
  )
  const portfolioUnrealizedPnL = assetsWithPrecomputedDataBySize.reduce(
    (accum, cur) => {
      return accum + cur.unrealizedPnL
    },
    0,
  )

  const portfolioUsdValue = assetsWithPrecomputedDataBySize.reduce(
    (accum, cur) => {
      return accum + cur.usdValueOfAssetPosition
    },
    0,
  )

  const portfolioUsdValueAtLastClose = assetsWithPrecomputedDataBySize.reduce(
    (accum, cur) => {
      return accum + (cur.usdValueOfAssetPosition - cur.dailyReturnUsd)
    },
    0,
  )

  const portfolioDailyReturnPercent = getPercentageChange(
    portfolioUsdValueAtLastClose,
    portfolioUsdValue,
  )
  const portfolioDailyReturnUsd =
    portfolioUsdValue - portfolioUsdValueAtLastClose

  let portfolioChartValueData: number[] = []
  assetsWithPrecomputedDataBySize.forEach((assetData) => {
    assetData.assetPortfolioValuePriceChartCloseData.forEach((val, idx) => {
      const accumPortfolioValueForDay = portfolioChartValueData[idx] ?? 0
      const assetValueForDay = val
      //   assetData.assetPortfolioValuePriceChartCloseData[idx]
      portfolioChartValueData[idx] =
        accumPortfolioValueForDay + assetValueForDay
    })
  })

  const priceHistoryTimestamps =
    assetsWithPrecomputedDataBySize[0]
      .assetPortfolioValuePriceChartTimestampData

  const portfolioAmountDailyAreaChartData = mapChartDataArraysToObjects(
    portfolioChartValueData,
    priceHistoryTimestamps,
  )

  const portfolioTotalCostToAcquireInUsd =
    assetsWithPrecomputedDataBySize.reduce((accum, cur) => {
      return accum + cur.totalCostToAcquireInUsd
    }, 0)

  const portfolioCompositionPieChartData: PieChartDatum[] = []
  assetsWithPrecomputedDataBySize.forEach((assetData) => {
    const datum: PieChartDatum = {
      key: assetData.symbol,
      value: assetData.usdValueOfAssetPosition,
    }
    portfolioCompositionPieChartData.push(datum)
  })

  // NOTE(johnrjj) - Total Return is different than 'current value' of portfolio.
  // Total return takes into account realized and unrealized gains which implicitly take into account cost basis
  const totalReturnBothRealizedAndUnrealized =
    portfolioRealizedPnL + portfolioUnrealizedPnL
  const portfolioTotalReturnSinceInceptionUsd =
    totalReturnBothRealizedAndUnrealized

  const portfolioTotalReturnSinceInceptionPercent = getPercentageChange(
    portfolioTotalCostToAcquireInUsd,
    totalReturnBothRealizedAndUnrealized,
  )

  return {
    assetDatas: assetsWithPrecomputedDataBySize,
    portfolioRealizedPnL: portfolioRealizedPnL,
    portfolioUnrealizedPnL: portfolioUnrealizedPnL,
    portfolioUsdValue: portfolioUsdValue,
    portfolioAmountDailyAreaChartData,
    portfolioCompositionPieChartData,
    portfolioDailyReturnPercent,
    portfolioDailyReturnUsd,
    portfolioTotalCostToAcquireInUsd,
    portfolioTotalReturnSinceInceptionUsd,
    portfolioTotalReturnSinceInceptionPercent,
  }
}

const getPercentageChange = (oldNumber: number, newNumber: number) => {
  const increaseValue = newNumber - oldNumber
  return (increaseValue / oldNumber) * 100
}

// Get d3 friendly chart data ready
const mapChartDataArraysToObjects = (
  values: number[],
  unixTimestamps: number[],
): AreaChartDatum[] => {
  const chartDataReadyFormat: {
    value: number
    date: number
  }[] = []

  values.forEach((val, idx) => {
    const datum = {
      value: val,
      date: unixTimestamps[idx],
    }
    chartDataReadyFormat.push(datum)
  })

  return chartDataReadyFormat
}

export { usePortfolioDerivedData }
