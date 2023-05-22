import { Cell, Column, Row, TableBody, TableHeader } from 'react-stately'
import Image from 'next/image'
import { useEffect } from 'react'
import styled from 'styled-components'
import { useAsyncList } from 'react-stately'
import { Table } from './Table'
import {
  prettyFormatCurrency,
  prettyFormatNumber,
  prettyFormatPercent,
} from '../../utils/formatters/number-formatter'

interface TableRowData {
  name: string
  symbol: string
  price: number
  logoURI: string
  realizedPnL: number
  unrealizedPnL: number
  availableBalance: number
  dailyReturnUsd: number
  dailyReturnPercent: number
  usdValueOfAssetPosition: number
  averageEntryPriceOfRemainingBuys: number
}

interface TableProps {
  assets: TableRowData[]
}

const greenBackground = '#193129'
const greenForeground = '#37C180'
const greenTextColor = '#57C192'

const redBackground = '#2F1819'
const redForeground = '#DA4848'
const redTextColor = '#F15659'

export const getTextColor = (n: number) => {
  let textColor = '#ffffff'
  if (n > 0) {
    textColor = greenTextColor
  } else if (n < 0) {
    textColor = redTextColor
  }

  return textColor
}

export const getBgColor = (n: number) => {
  let textColor = 'rgb(43, 43, 45)'
  if (n > 0) {
    textColor = greenBackground
  } else if (n < 0) {
    textColor = redBackground
  }

  return textColor
}

function PortfolioAssetsTable(props: TableProps) {
  const loadDataFromProps = async (_args: any) => {
    return {
      items: props.assets,
    }
  }

  const list = useAsyncList<TableRowData>({
    async load({ signal }) {
      return loadDataFromProps({ signal })
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          const first = a[sortDescriptor.column as keyof TableRowData]!
          const second = b[sortDescriptor.column as keyof TableRowData]!
          let cmp =
            (parseInt(first.toString(10)) || first) <
            (parseInt(second.toString(10)) || second)
              ? -1
              : 1
          if (sortDescriptor.direction === 'descending') {
            cmp *= -1
          }
          return cmp
        }),
      }
    },
  })

  // KLUDGE(johnrjj) - Figure out how to plumb data better w/ useAsyncList
  useEffect(() => {
    list.reload()
  }, [props.assets])

  return (
    <Table
      style={{
        width: '100%',
      }}
      aria-label="Portfolio Assets Table"
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
    >
      <TableHeader>
        <Column key="name" allowsSorting>
          <HeaderTitleSpan>Asset</HeaderTitleSpan>
        </Column>
        <Column key="availableBalance" allowsSorting>
          <HeaderTitleSpan>Size</HeaderTitleSpan>
        </Column>
        <Column key="price" allowsSorting>
          <HeaderTitleSpan>Price</HeaderTitleSpan>
        </Column>
        <Column key="averageEntryPriceOfRemainingBuys" allowsSorting>
          <HeaderTitleSpan>Avg Entry</HeaderTitleSpan>
        </Column>
        <Column key="dailyReturnPercent" allowsSorting>
          <HeaderTitleSpan>Daily Return</HeaderTitleSpan>
        </Column>
        <Column key="usdValueOfAssetPosition" allowsSorting>
          <HeaderTitleSpan>Value</HeaderTitleSpan>
        </Column>
        <Column key="realizedPnL" allowsSorting>
          <HeaderTitleSpan>Realized PnL</HeaderTitleSpan>
        </Column>
        <Column key="unrealizedPnL" allowsSorting>
          <HeaderTitleSpan>Unrealized PnL</HeaderTitleSpan>
        </Column>
      </TableHeader>
      <TableBody items={list.items}>
        {(item) => {
          return (
            <Row key={item.name}>
              {(columnKey) => {
                if (columnKey === 'name') {
                  return (
                    <Cell>
                      <span
                        style={{
                          paddingTop: 8,
                          paddingBottom: 8,
                          display: 'inline-flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              marginRight: 12,
                              height: 36,
                              width: 36,
                              overflow: 'hidden',
                              borderRadius: '100%',
                              position: 'relative',
                            }}
                          >
                            <Image
                              alt={`${item.name}-asset-logo`}
                              src={item.logoURI}
                              height={36}
                              width={36}
                            />
                          </div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{item.name}</div>
                        </div>
                      </span>
                    </Cell>
                  )
                }

                if (columnKey === 'price') {
                  return (
                    <Cell>
                      <span
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          whiteSpace: 'nowrap',
                          padding: '8px 0px',
                          borderRadius: 8,
                          fontWeight: 500,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        <span style={{ color: '#ffffff' }}>
                          {prettyFormatCurrency(item.price)}
                        </span>
                      </span>
                    </Cell>
                  )
                }

                if (columnKey === 'availableBalance') {
                  return (
                    <Cell>
                      <span
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          whiteSpace: 'nowrap',
                          padding: '8px 0px',
                          borderRadius: 8,
                          fontWeight: 500,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        <span style={{ color: '#ffffff' }}>
                          <span style={{ fontWeight: 500 }}>
                            {prettyFormatNumber(item.availableBalance)}
                          </span>{' '}
                          {item.symbol}
                        </span>
                      </span>
                    </Cell>
                  )
                }

                if (columnKey === 'averageEntryPriceOfRemainingBuys') {
                  return (
                    <Cell>
                      <span
                        style={{
                          display: 'inline-flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 0px',
                          borderRadius: 8,
                          fontWeight: 500,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        <div>
                          {prettyFormatCurrency(
                            item.averageEntryPriceOfRemainingBuys,
                          )}
                        </div>
                      </span>
                    </Cell>
                  )
                }

                if (columnKey === 'dailyReturnPercent') {
                  return (
                    <Cell>
                      <span
                        style={{
                          display: 'inline-flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 0px',
                          borderRadius: 8,
                          fontWeight: 500,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        <div
                          style={{
                            color: getTextColor(item.dailyReturnUsd),
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {prettyFormatCurrency(item.dailyReturnUsd)} (
                          {prettyFormatPercent(item.dailyReturnPercent / 100)})
                        </div>
                      </span>
                    </Cell>
                  )
                }

                if (columnKey === 'realizedPnL') {
                  return (
                    <Cell>
                      <span
                        style={{
                          textAlign: 'right',
                          display: 'inline-flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '8px 12px',
                          borderRadius: 8,
                          background: getBgColor(item.realizedPnL),
                          fontWeight: 500,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        <div
                          style={{
                            color: getTextColor(item.realizedPnL),
                            textAlign: 'right',
                          }}
                        >
                          {prettyFormatCurrency(item.realizedPnL)}
                        </div>
                      </span>
                    </Cell>
                  )
                }

                if (columnKey === 'unrealizedPnL') {
                  return (
                    <Cell>
                      <span
                        style={{
                          display: 'inline-flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: 8,
                          background: getBgColor(item.unrealizedPnL),
                          minWidth: 105,
                          fontWeight: 500,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        <div
                          style={{ color: getTextColor(item.unrealizedPnL) }}
                        >
                          {prettyFormatCurrency(item.unrealizedPnL)}
                        </div>
                      </span>
                    </Cell>
                  )
                }

                if (columnKey === 'usdValueOfAssetPosition') {
                  return (
                    <Cell>
                      <span
                        style={{
                          display: 'inline-flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 0px',
                          borderRadius: 8,
                          fontWeight: 500,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        <div>
                          {prettyFormatCurrency(item.usdValueOfAssetPosition)}
                        </div>
                      </span>
                    </Cell>
                  )
                }
                // Default basic row w/ column key's value
                return (
                  <Cell>
                    <span
                      style={{
                        paddingTop: 8,
                        paddingBottom: 8,
                        display: 'inline-flex',
                      }}
                    >
                      {item[columnKey as keyof TableRowData]}
                    </span>
                  </Cell>
                )
              }}
            </Row>
          )
        }}
      </TableBody>
    </Table>
  )
}

const HeaderTitleSpan = styled.span`
  text-transform: uppercase;
  color: #abadae;
  padding-bottom: 20px;
`

export { PortfolioAssetsTable }
