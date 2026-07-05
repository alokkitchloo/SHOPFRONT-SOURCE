# Decisions

## The one I went back and forth on: where does "selected variant" state live?

I had three real options for the color/size selection on the product detail page:

1. **Local component state** (`useState` inside `ProductDetailPage`) — simplest, but
   loses the "deep-linkable" requirement entirely; a shared link would always land
   on the default variant.
2. **Global state** (put it in the same Context as the cart) — technically works,
   but it's not actually global information. Nothing outside the product detail page
   needs to know which color is selected, and shoving page-local UI state into a
   shared context makes that context harder to reason about as the app grows.
3. **URL search params** (`useSearchParams`, `?color=Black&size=M`) — what I built.

I went with URL params because the requirement isn't really "remember the
selection," it's "make the page shareable," and the URL is the correct owner of any
state that changes what's rendered and needs to survive a page load or be copy-pasted
to someone else. It also gives me the deep-link requirement essentially for free
instead of writing extra plumbing to sync some other store to the URL. The trade-off
is a bit more indirection when reading the selected variant back out (`searchParams.get`
plus a fallback to the product's first color/size instead of a plain `useState`
default), and the `useEffect` that back-fills a missing `color`/`size` into the URL
on first load is a little more ceremony than a single `useState(initialColor)` would
have been. I think that's a fair price for not having two sources of truth for the
same thing.

For the **cart itself**, I did use Context + `useReducer` (not URL, not a routing
library, not Redux). The cart is genuinely cross-page/global state, `useReducer`
gives predictable, testable transitions for add/remove/set-quantity without needing
an extra dependency, and the app is small enough that Redux/Zustand would be adding
ceremony without buying anything back.

## What I'd clean up with more time

- **`deriveProduct.ts`'s seeded-random approach is a workaround, not a real solution.**
  It exists because the Fake Store API has no variants/brand/sale data. In a real
  codebase I'd rather this logic lived in a mock backend/MSW handler so the frontend
  code has no idea the data is synthetic — right now that concern leaks into the
  frontend's data layer.
- **The cart drawer's Checkout button is a no-op.** There's no checkout flow in the
  spec, but a real PR would either wire it to something or clearly mark it disabled
  with a tooltip rather than leaving a button that silently does nothing.
- **Accessibility pass:** focus is trapped correctly for keyboard nav on buttons, but
  the cart drawer doesn't trap focus or restore it to the triggering element on
  close — I'd add a small focus-trap for a real release.
- **Component test coverage stops at variant selection.** I'd add tests for the cart
  reducer itself (quantity clamping, add-existing-line-merges-quantity) given more
  time, since that logic is at least as important as the UI states.
