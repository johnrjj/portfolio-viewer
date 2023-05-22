# Portfolio Viewer

View aggregated realtime portfolio data based on user-provided buy and sell trade history. Portfolio viewer analyzes trade history to provide portfolio-level and asset-level financial data, including PnL (realized, unrealized), cost basis, various return profiles, and current portfolio composition.

This application uses fully-working realtime pricing data. Simply provide your buy and sell trade history and it will do the rest of the work with a live UI and accurate data.

Currently only supports First-in first-out method (FIFO), but the codebase has been built to support arbitrary inventory valuation methods if there is demand.

## Demo

Visit https://portfolio-viewer.vercel.app to view a demo with sample trade history.

## To run locally

Clone the repo

```bash
git clone https://github.com/johnrjj/portfolio-viewer
cd portfolio-viewer
```

Configure the environment variable

```bash
cp .sample.env .env
vim .env # add your Defined.fi API key
```

Install dependencies and run locally

```bash
pnpm i
pnpm dev
```

### To configure trades

Eventually there would be a UI to import and edit trades. For now, you can manually edit `data/historical-trades` data.

## Notable features

1. This is a fully functional portfolio viewer:

- USD pricing data and chart data are all real, live data powered by Defined.fi

2. Complete client-side support for private data.

- Asset and portfolio values, charts, and performance are all calculated client side just-in-time to minimize reliance on a centralized server.
- Your trade data never needs to touch the server, preserving privacy (although it can for convenience).
- The only **required** calls to remote servers is to get generic, non-identifying asset pricing data.

## How to use

Update `data/historical-trades.ts` with any trades you'd like. The data format is based off Coinbase's exportable data format for taxes.

The portfolio intelligently knows when it is missing a corresponding 'buy' event for your cost basis and will default the buy cost basis as zero if no matching buy event is found.

## Future work

- More client-side features
  - Add a import/export feature for Trades (Buys and Sells)
  - Client-side database using IndexedDB (via Dexie)
  - Add an in-table editor for fixing/editing trade data
- Notifications
  - Default notifications (e.g. 'Portfolio up 5% for the day')
  - Customizable notifications (e.g. User can set a threshold on when to push browser alert)
  - I left some initial notifications scaffolding in the `/scratch` folder
- Loading states
- Auto-import for wallet addresses on popular chains
- Search/filtering
- Recent trades table under the assets table
- Use BigInt for everything instead of number (or even Decimal/BigNumber library)
- Click an asset and go to an 'Asset' page with trade over view and have a focused view on the selected asset

## Design philosophy

- Composition rules everything around me

  - We keep everything modular and compose up our view layer. We're able to compose trade history + realtime prices + realtime historical pricing data that aggregates into a nice UI. This makes it

- No classes. Everything is plain old object based and the codebase relies on pure functions to operate on data.

  - This makes it easier to serialize state, persist and store data, and much better compatibility with off-the-shelf tooling and state management libraries.

- Build stuff in shippable chunks.
  - I opt-ed not to include e.g. notifications in scope in lieu of delivering a working portfolio viewer. Additional functionality can be layered on over time, thanks to the flexibility of the codebase.

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example) or preview live with [StackBlitz](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-styled-components)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-styled-components&project-name=with-styled-components&repository-name=with-styled-components)
