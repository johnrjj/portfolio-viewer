# Portfolio Viewer

View realtime portfolio data based on provided trade data.

- Import your buys and sells of assets from { Coinbase, Fidelity, etc }.
- View aggregated data about your positions (PnL, Cost Basis, Returns, etc)

## Notable features

This is a fully functional portfolio viewer:

- USD pricing data and chart data are all real, live data powered by Defined.fi

Completely client-side for private data.

- Asset values, charts, and performance are all calculated client side
- Your trade data never needs to touch the server.
- The only required calls to remote servers is to get generic, non-identifying asset pricing data.

## Future work

- More client-side feature
  - Add a import/export feature for Trades (Buys and Sells)
  - Client-side database using IndexedDB (via Dexie)
  - Add an in-table editor for fixing/editing trade data
- Customizable notifications
- Auto-import for wallet addresses on popular chains

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example) or preview live with [StackBlitz](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-styled-components)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-styled-components&project-name=with-styled-components&repository-name=with-styled-components)
