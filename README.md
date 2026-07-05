# Shopfront — Mini E-Commerce App

A small storefront built with **React 18 + TypeScript + Vite + Sass modules**, using
the [Fake Store API](https://fakestoreapi.com) for product data.

Live URL: https://shopfront-source.vercel.app/

## Setup

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build      # type-checks then builds to /dist
npm run preview    # serve the production build locally
npm test            # run the unit test suite (Vitest)
```

Requires Node 18+. No environment variables or API keys needed — the Fake Store API
is public and unauthenticated.

## What's implemented

- **Product listing (`/`)** — responsive grid from the Fake Store API, quick-add
  button on each card, image/title link through to the detail page
- **Product detail (`/product/:id`)** — image gallery with clickable thumbnails,
  color swatches, size buttons with in-stock/low-stock/sold-out states, quantity
  picker capped to available stock, selected variant reflected in the URL
  (`?color=Black&size=M`) so any combination is deep-linkable and survives a refresh
- **Navbar + cart drawer** — cart icon with item-count badge, right-side drawer with
  line items (thumbnail, variant, quantity, price), quantity/remove controls, and a
  subtotal/total summary
- **State & persistence** — cart is Context API + `useReducer`, persisted to
  `localStorage` and rehydrated on load
- **Responsive layout** — two-column detail page / grid listing on desktop,
  single-column with horizontally-scrolling thumbnails on mobile (≤767px)
- **Loading / error / empty states** — listing and detail pages both show a loading
  state, a retryable error state, and the cart drawer has an explicit empty state
- **Bonus: unit tests** (Vitest + Testing Library) — sold-out size buttons are
  disabled and unselectable, quantity picker is capped at available stock, and the
  product card's quick-add CTA is disabled when a product is fully sold out.
  Run with `npm test`.
- **Bonus: mock async Add to Cart** — clicking Add to Cart calls a simulated network
  request (400–800ms delay, ~12% random failure) before the item actually lands in
  the cart, with a loading state and an inline error on failure (see
  `src/hooks/useAddToCart.ts`).

## Why the product data looks the way it does

The Fake Store API has no brand, variants, sale price, or multiple images — but the
spec needs all of those. `src/data/deriveProduct.ts` derives them **deterministically**
from each product's id using a small seeded PRNG (`src/utils/random.ts`), so:

- The same product always gets the same brand, colors, sizes, sale price, and stock
  levels on every reload — a deep link to a specific sold-out variant still shows it
  as sold out after a refresh, since it isn't randomized per-request.
- The catalog still exercises every UI state the spec cares about (sold out, low
  stock, on sale, multiple colors/sizes) without needing a custom backend.

## Project structure

```
src/
  api/            Fake Store API client
  components/     Reusable UI (Navbar, CartDrawer, ProductCard, ColorSwatches,
                   SizeButtons, QuantityPicker, Gallery, StockTag, StatusScreens)
  context/        CartContext (Context API + useReducer + localStorage)
  data/           deriveProduct.ts (variant/brand/sale-price generation), constants
  hooks/          useProducts, useProduct, useLocalStorage, useAddToCart
  pages/          ProductListingPage, ProductDetailPage
  styles/         Sass tokens + global styles
  types/          Shared TypeScript types
tests/            Vitest unit tests
```

## Deploying

Any static host works since this is a client-side Vite build:

**Vercel:** `npx vercel` from the project root (or connect the GitHub repo in the
Vercel dashboard — it auto-detects Vite). Build command `npm run build`, output
directory `dist`.

**Netlify:** connect the repo, or `npx netlify deploy --prod` — build command
`npm run build`, publish directory `dist`.

After deploying, add the live URL to the top of this README.

## Design

See the "signature" note in `src/styles/_tokens.scss` — the visual language leans
into inventory/retail signage (condensed uppercase headings, monospace for prices
and stock counts, tag-style stock chips, a receipt-style dashed total in the cart
drawer) since the spec's real emphasis is on inventory states, not decoration.
