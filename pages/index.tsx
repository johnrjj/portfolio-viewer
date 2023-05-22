import Head from 'next/head'
import dynamic from 'next/dynamic'
import useMeasure from 'react-use-measure'
import {
  PortfolioAssetsTable,
  getBgColor,
  getTextColor,
} from '../components/table/PortfolioAssetsTable'
import { StatusIcon } from '../components/StatusIcon'
import { Spacer } from '../components/Spacer'
import { useAssets } from '../hooks/useAssets'
import { useTradeHistory } from '../hooks/useTradeHistory'
import { usePriceCharts } from '../hooks/usePriceCharts'
import { usePrices } from '../hooks/usePrices'
import { usePortfolioDerivedData } from '../hooks/usePortfolioDerivedData'
import {
  prettyFormatCurrency,
  prettyFormatPercent,
} from '../utils/formatters/number-formatter'
const AreaChartLazy = dynamic(() => import('../components/charts/AreaChart'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
})
const PieChartLazy = dynamic(() => import('../components/charts/PieChart'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
})

export default function PortfolioOverviewPage() {
  const { data: tradeData } = useTradeHistory()
  const { assets } = useAssets(tradeData?.trades)

  const supportedAssetAddresses = tradeData?.assetsMetadata?.map(
    (x) => x.address,
  )
  const { data: pricesMap } = usePrices(supportedAssetAddresses)
  const { data: priceChartsMap } = usePriceCharts(supportedAssetAddresses)

  const derivedPortfolioData = usePortfolioDerivedData(
    assets,
    tradeData?.assetsMetadata,
    pricesMap,
    priceChartsMap,
  )

  // Dynamically resize SVG charts
  const [areaChartMeasureRef, areaChartMeasure] = useMeasure()
  const [pieChartMeasureRef, pieChartMeasurement] = useMeasure()

  return (
    <>
      <Head>
        <title>Portfolio Tracker</title>
        <meta name="description" content="Portfolio Tracker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div
          style={{
            maxWidth: 1264,
            margin: '0 auto',
            padding: 32,
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h1 style={{ fontSize: 24, fontWeight: 500, paddingLeft: 24 }}>
              Your Portfolio
            </h1>
            <div
              style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}
            >
              <div style={{ marginRight: 8, fontWeight: 500 }}>
                {derivedPortfolioData
                  ? `Connected to realtime data`
                  : `Loading portfolio data...`}
              </div>
              {derivedPortfolioData && <StatusIcon />}
            </div>
          </div>
          <Spacer size={24} />
          {/* Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '3fr 1fr',
              gridTemplateRows: '500px 1fr',
              gridColumnGap: 32,
              gridRowGap: 32,
            }}
          >
            {/* Top panel */}
            <div
              style={{
                gridArea: '1 / 1 / 2 / 3',
                border: '2px solid #2B2B2D',
                borderRadius: 16,
                background: '#1C1E1F',
                display: 'flex',
                flex: 1,
                flexDirection: 'row',
                overflow: 'hidden',
              }}
            >
              {/* Top left (overview) */}
              <div
                style={{
                  display: 'flex',
                  flex: 3,
                  padding: '24px 24px 16px 24px',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ color: '#989A9C', fontWeight: 500 }}>
                      Portfolio value
                    </div>
                    <Spacer size={6} />
                    <h2
                      style={{
                        fontSize: 48,
                        fontWeight: 600,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {derivedPortfolioData?.portfolioUsdValue
                        ? prettyFormatCurrency(
                            derivedPortfolioData.portfolioUsdValue,
                          )
                        : '-'}
                    </h2>
                  </div>
                  <div style={{ marginRight: 0 }}>
                    {derivedPortfolioData && (
                      <div>
                        <h4
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: '#989A9C',
                          }}
                        >
                          Daily return
                        </h4>
                        <Spacer size={4} />

                        <div
                          style={{
                            width: 'fit-content',
                            padding: '8px 12px',
                            fontVariantNumeric: 'tabular-nums',
                            borderRadius: 8,
                            background: getBgColor(
                              derivedPortfolioData.portfolioDailyReturnUsd,
                            ),
                            display: 'flex',
                            fontWeight: 500,
                            color: getTextColor(
                              derivedPortfolioData.portfolioDailyReturnUsd,
                            ),
                          }}
                        >
                          <div style={{}}>
                            {prettyFormatCurrency(
                              derivedPortfolioData.portfolioDailyReturnUsd,
                              true,
                            )}
                          </div>
                          <div style={{ marginLeft: 4 }}>
                            (
                            {prettyFormatPercent(
                              derivedPortfolioData.portfolioDailyReturnPercent /
                                100,
                            )}
                            )
                          </div>
                        </div>

                        <Spacer size={8} />

                        <div>
                          <h4
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: '#989A9C',
                            }}
                          >
                            Portfolio lifetime return
                          </h4>
                          <Spacer size={4} />
                          <div
                            style={{
                              width: 'fit-content',
                              padding: '8px 12px',
                              borderRadius: 8,
                              fontVariantNumeric: 'tabular-nums',

                              background: getBgColor(
                                derivedPortfolioData.portfolioTotalReturnSinceInceptionUsd,
                              ),
                              display: 'flex',
                              fontWeight: 500,
                              color: getTextColor(
                                derivedPortfolioData.portfolioTotalReturnSinceInceptionUsd,
                              ),
                            }}
                          >
                            <div>
                              {prettyFormatCurrency(
                                derivedPortfolioData.portfolioTotalReturnSinceInceptionUsd,
                                true,
                              )}
                            </div>

                            <div style={{ marginLeft: 4 }}>
                              (
                              {prettyFormatPercent(
                                derivedPortfolioData.portfolioTotalReturnSinceInceptionPercent /
                                  100,
                              )}
                              )
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Spacer size={4} />

                <div
                  ref={areaChartMeasureRef}
                  style={{
                    position: 'relative',
                    flex: 1,
                    maxHeight: '100%',
                    height: '100%',
                  }}
                >
                  <div style={{ position: 'absolute' }}>
                    {derivedPortfolioData?.portfolioAmountDailyAreaChartData && (
                      <AreaChartLazy
                        data={
                          derivedPortfolioData.portfolioAmountDailyAreaChartData
                        }
                        margin={{
                          top: 8,
                          bottom: 24,
                          left: 0,
                          right: 0,
                        }}
                        width={areaChartMeasure.width}
                        height={areaChartMeasure.height}
                      />
                    )}
                  </div>
                </div>
              </div>
              {/* Top right (overview breakdown) */}
              <div
                style={{
                  display: 'flex',
                  flex: 2,
                  borderLeft: '2px solid #2B2B2D',
                  background: '#232526',
                  padding: '24px 24px 16px 24px',
                  flexDirection: 'column',
                }}
              >
                <div style={{ color: '#989A9C', fontWeight: 500 }}>
                  Portfolio composition
                </div>
                <div
                  ref={pieChartMeasureRef}
                  style={{ display: 'flex', position: 'relative', flex: 1 }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                    }}
                  >
                    <PieChartLazy
                      data={
                        derivedPortfolioData?.portfolioCompositionPieChartData ??
                        []
                      }
                      height={pieChartMeasurement.height}
                      width={pieChartMeasurement.width}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Bottom left (assets overview) */}
            <div
              style={{
                gridArea: '2 / 1 / 3 / 3',
                border: '2px solid #2B2B2D',
                borderRadius: 16,
                padding: '36px 24px 16px 24px',
              }}
            >
              <PortfolioAssetsTable
                assets={derivedPortfolioData?.assetDatas ?? []}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
