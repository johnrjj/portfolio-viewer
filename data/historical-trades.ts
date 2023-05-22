import { TradeEvent } from '../utils/cost-basis.types'

const SAMPLE_TRADES: TradeEvent[] = [
  {
    amount: 4 * 3688,
    asset: 'BTC',
    buyDate: 1547978715,
    type: 'BUY',
    unitsBought: 4,
    unitPrice: 3688,
  },
  {
    amount: 10 * 3765,
    asset: 'BTC',
    buyDate: 1549793115,
    type: 'BUY',
    unitsBought: 10,
    unitPrice: 3765,
  },
  {
    amount: 3 * 8412.5,
    asset: 'BTC',
    sellDate: 1557479115,
    type: 'SELL',
    unitsSold: 3,
    unitPrice: 8412.5,
  },
  {
    amount: 1 * 8512.23,
    asset: 'BTC',
    sellDate: 1557479115,
    type: 'SELL',
    unitsSold: 1,
    unitPrice: 8512.23,
  },
  {
    amount: 8 * 6244.22,
    asset: 'BTC',
    buyDate: 1583831115,
    type: 'BUY',
    unitsBought: 8,
    unitPrice: 6244.22,
  },
  {
    amount: 2012.4 * 32,
    asset: 'ETH',
    buyDate: 1653175091,
    type: 'BUY',
    unitsBought: 32,
    unitPrice: 2012.4,
  },
  {
    amount: 2.02 * 6000,
    asset: 'SOL',
    buyDate: 1653175091,
    type: 'BUY',
    unitsBought: 6000,
    unitPrice: 2.02,
  },

  {
    amount: 26.12 * 500,
    asset: 'SOL',
    sellDate: 1674209115,
    type: 'SELL',
    unitsSold: 500,
    unitPrice: 26.12,
  },
  {
    amount: 1905 * 6,
    asset: 'ETH',
    sellDate: 1682154315,
    type: 'SELL',
    unitsSold: 6,
    unitPrice: 1905,
  },

  {
    amount: 0.22 * 40_000,
    asset: 'MATIC',
    buyDate: 1653175091,
    type: 'BUY',
    unitsBought: 40_000,
    unitPrice: 0.22,
  },
]

const SOL_ADDRESS = '0xd31a59c85ae9d8edefec411d448f90841571b89c'
const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
const BTC_ADDRESS = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'
const MATIC_ADDRESS = '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0'
const PEPE_ADDRESS = '0x6982508145454ce325ddbe47a25d4ec3d2311933'

export interface SupportedAsset {
  name: string
  symbol: string
  address: `0x${string}`
  logoURI: string
}

const SAMPLE_ASSETS: SupportedAsset[] = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    address: WETH_ADDRESS,
    logoURI: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  },
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    address: BTC_ADDRESS,
    logoURI: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  },
  {
    name: 'Pepe',
    symbol: 'PEPE',
    address: PEPE_ADDRESS,
    logoURI:
      'https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg',
  },
  {
    name: 'Polygon',
    symbol: 'MATIC',
    address: MATIC_ADDRESS,
    logoURI:
      'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    address: SOL_ADDRESS,
    logoURI: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
  },
]

export { SAMPLE_TRADES, SAMPLE_ASSETS }
