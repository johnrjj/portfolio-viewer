import { GraphQLClient, gql } from 'graphql-request'
import type {
  DefinedApiUsdPriceResponse,
  GetTimeSeriesArgs,
  GetTimeSeriesResponse,
  GetUsdPriceArgs,
} from './defined.types'

const DEFINED_API_KEY = process.env.NEXT_PUBLIC_DEFINED_API_KEY
const DEFINED_API_ROOT_URI = 'https://api.defined.fi'

export const definedGraphQLClient = new GraphQLClient(DEFINED_API_ROOT_URI, {
  headers: {
    'x-api-key': DEFINED_API_KEY!,
  },
})

export const definedTokenPricesGql = `
query GetTokenPrices($inputs: [GetPriceInput!]) {
  getTokenPrices(inputs: $inputs) {
    address
    networkId
    priceUsd
    timestamp
  }
}`

export type Price = {
  address: string
  networkId: number
  priceUsd: number
  timestamp: number
}

export type TokenPricesQueryResult = {
  getTokenPrices: Price[]
}

export const fetchUsdPrices = async (
  inputs: GetUsdPriceArgs,
): Promise<DefinedApiUsdPriceResponse> => {
  try {
    const { getTokenPrices } =
      await definedGraphQLClient.request<TokenPricesQueryResult>(
        definedTokenPricesGql,
        {
          inputs,
        },
      )

    return getTokenPrices
  } catch (err: any) {
    throw err
  }
}

const definedTimeSeriesGql = gql`
  query GetBars(
    $from: Int!
    $resolution: String!
    $symbol: String!
    $to: Int!
    $removeLeadingNullValues: Boolean
  ) {
    getBars(
      from: $from
      resolution: $resolution
      symbol: $symbol
      to: $to
      removeLeadingNullValues: $removeLeadingNullValues
    ) {
      c
      h
      l
      o
      s
      t
      volume
    }
  }
`
type TimeSeriesArgs = GetTimeSeriesArgs & { to: number; from: number }

export const fetchTimeSeries = async ({
  address,
  chainId,
  resolution,
  currencyCode,
  removeLeadingNullValues,
  to,
  from,
}: TimeSeriesArgs): Promise<GetTimeSeriesResponse> => {
  const symbol = `${address}:${chainId}`
  try {
    const { getBars } = await definedGraphQLClient.request<{
      getBars: GetTimeSeriesResponse
    }>(definedTimeSeriesGql, {
      to,
      from,
      symbol,
      resolution,
      currencyCode,
      removeLeadingNullValues,
    })

    return getBars
  } catch (err: any) {
    throw err
  }
}
