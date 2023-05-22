import { z } from 'zod'

const booleanParamSchema = z
  .enum(['true', 'false'])
  .transform((value: string) => value === 'true')

export const definedTimeSeriesSchema = z.object({
  address: z.string(),
  chainId: z.string(),
  to: z.number(),
  from: z.number(),
  resolution: z.string(),
  currencyCode: z.string(),
  removeLeadingNullValues: booleanParamSchema,
})

export const definedUsdPriceInputSchema = z.object({
  address: z.string(),
  networkId: z.coerce.number(),
  timestamp: z.coerce.number().optional(),
})

export const definedUsdPriceSchema = z.preprocess(
  (arg: any) => JSON.parse(decodeURIComponent(arg)),
  z.array(definedUsdPriceInputSchema),
)

export type GetTimeSeriesArgs = z.infer<typeof definedTimeSeriesSchema>

export type GetPriceInput = z.infer<typeof definedUsdPriceInputSchema>

export type GetUsdPriceArgs = GetPriceInput[]

export type Price = {
  address: string
  networkId: number
  priceUsd: number
  timestamp: number
}

export interface GetTimeSeriesResponse {
  c: number[]
  h: number[]
  l: number[]
  o: number[]
  s: string
  t: number[]
  volume: (string | null)[]
}

export type OHLCTradingViewCompatibleChartData = GetTimeSeriesResponse

export type DefinedApiUsdPriceResponse = Price[]

export interface DefinedApiExchange {
  address: string
  id: string
  name?: string
  iconUrl?: string
  networkId: number
  tradeUrl?: string
}
