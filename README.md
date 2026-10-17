# Korsó 🍺 Budapest beer price radar

Compare and share beer prices across Budapest pubs. Beta version.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Deploy (static hosting)

The app is a fully static site: `npm run build` outputs plain files to `dist/` that any static host can serve. Asset paths are relative (`base: './'` in `vite.config.ts`) and tabs use `#hash` links, so it works from a subfolder with no server config.

**GitHub Pages** (workflow in `.github/workflows/deploy.yml`):

1. Push this folder to a GitHub repo, on the `main` branch
2. In the repo: Settings → Pages → Source: **GitHub Actions**
3. Every push to `main` builds and deploys to `https://<user>.github.io/<repo>/`

**Netlify / Vercel / Cloudflare Pages**: build command `npm run build`, output folder `dist`.

## What's in the beta

- **Prices**: search, filter by district / style / draft, and sort by price per liter, price, or newest
- **Map**: every pub as a pin showing its cheapest pint (green = cheap, red = pricey, 👑 = cheapest in town); tap for its full beer list; filter by style
- **Compare**: cheapest-beer leaderboard, average 0.5 l price by style and by district, fun facts
- **Add a price**: form with validation and an optional map picker to pin the pub; submissions are saved in the browser (localStorage)
- Demo data in `src/data/seed.ts` (pub names and prices are made up)

## Project layout

```
src/
  types.ts              data model, styles, districts, sizes
  data/seed.ts          demo prices
  lib/prices.ts         usePrices() hook + formatting helpers
  data/locations.ts     district centers + demo pub coordinates
  components/           Header, PriceList, PriceCard, MapView, LocationPicker, Compare, AddPriceForm, Bubbles
  index.css             the whole theme
```

Map tiles come from OpenStreetMap (free for light use, attribution required). For real traffic, switch to a tile provider such as MapTiler or Stadia in `src/components/mapParts.tsx`.

## Next ideas

- Shared backend (e.g. Supabase) so everyone sees submissions
- Cluster overlapping pins in the city center
- Upvote / confirm prices, flag outdated ones
- HU / EN language toggle
