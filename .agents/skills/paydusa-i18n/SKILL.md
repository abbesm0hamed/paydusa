---
name: paydusa-i18n
description: Owns three parallel i18n systems — next-intl (en/ar-RTL/fr messages, typed), PayloadCMS translations (admin + content locales), and Medusa regions (country/currency routing). Use when adding any storefront route, message string, translation, RTL work, region/currency work, or new locale to this monorepo.
---

# Paydusa i18n: Three Parallel Systems

Storefront URL shape: `/{locale}/{countryCode}/…`. **Locale ≠ country** — languages and Medusa regions are independent axes.

## 1. next-intl (storefront UI strings)

- Locales: `en` (default), `ar` (`rtl: true`), `fr` — defined in `apps/store/src/i18n/localization.ts` with `localization.locales`, `i18n = { fallbackLanguage: "en" }`.
- Routing: `apps/store/src/i18n/routing.ts` — `defineRouting({ localePrefix: "always" })` and `createNavigation(routing)` exporting `Link, redirect, usePathname, useRouter`.
- **Always import navigation from `@/i18n/routing` (or relative path), never `next/link` / `useRouter` from `next/navigation`.** Otherwise locale prefixes get lost.
- Messages: `apps/store/src/i18n/messages/{en,ar,fr}.json`. Adding a string = add to **all three files**. Types are anchored on `en.json` (`IntlMessages` augmented in `src/i18n/request.ts`) — a missing key in `en.json` fails type checks; missing translations fall back silently, still add them.
- New messages are arranged under a component-scoped namespace (e.g. `cart.checkoutError`). Reuse existing keys via `getLocalizedMessages(locale)` when server components need big chunks.
- next-intl plugin is wired in `apps/store/next.config.mjs` (`createNextIntlPlugin()`, default request config `src/i18n/request.ts`).

## 2. Proxy = locale +country authority

`apps/store/src/proxy.ts` (Next.js 16 renamed `proxy.ts`, OASIS legacy name "middleware"):

- `createIntlMiddleware(routing)` handles locale segment; the SAME proxy also resolves the `countryCode` segment.
- Region logic: caches a country→region map (1h TTL) from `${MEDUSA_BACKEND_URL}/store/regions` with the `x-publishable-api-key` header; country comes from URL → `x-vercel-ip-country` header → `NEXT_PUBLIC_DEFAULT_REGION` (default `"tn"`) → first region.
- Sets the `_medusa_cache_id` cookie and 307-redirects to insert `/[countryCode]`.
- Skips `/admin`, `/api`, `/_next`, `/_vercel`, `/graphql*`, `/next`, dotted paths.
- When touching the proxy, keep BOTH concerns (locale + region) intact — they are deliberately intertwined, don't split carelessly.

## 3. Medusa regions & currencies

- Seed (`apps/medusa/src/scripts/seed.ts`): regions **Europe** (gb, de, dk, se, fr, es, it; default provider) and **Africa (tn)**; currencies `eur` (default), `usd`, `tnd`.
- Country codes in URLs are lowercase ISO-2 (`tn`, `fr`, …) matched to the region map. Default region is Tunisia (`tn`).
- Region-aware data flows through `src/lib/data/regions.ts` (store server actions) → `getRegion(countryCode)`.
- When a new region is added in Medusa, the proxy map picks it up automatically (fetched at runtime); nothing to redeploy. Currency display formats come from the region's currency, not the UI locale.

## 4. PayloadCMS (admin + content)

- `payload.config.ts` receives `i18n` (admin UI labels: `{ fallbackLanguage: "en" }` from `localization.ts`) and a `localization` config for **content fields** (localized collection fields) as separate concerns.
- Any new Payload collection/field that is user-visible on the storefront: localize the field (`localized: true`) matching `localization` locales, and never reuse the next-intl message files for CMS content — CMS content lives in the database per-locale.
- `@payloadcms/translations` handles static admin strings; add new admin labels for all configured locales or rely on fallback.

## RTL (ar)

- `ar` is marked `rtl: true` in `localization.ts`. Never hardcode `dir`; derive from the resolved locale. Use Tailwind's logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `text-start/end`) rather than `ml-`/`mr-`/`left`/`right` so both directions work.
- Icons that imply direction (arrows, chevrons) should flip; don't flip brand/logos.
- Numeral/date rendering: use `Intl` formatter helpers already present in `src/utilities/formatDateTime.ts` patterns rather than locale-blind formatting.

## Adding a new locale (checklist)

1. Add to `localization.locales` (+ `rtl: true` if applicable) — both next-intl and Payload pick this up from the same source.
2. Create `src/i18n/messages/<code>.json` by copying `en.json`; keys are type-anchored on `en` so this is required for type-checks to pass.
3. Verify proxy redirect behaviour for the new prefix (no code change expected, but test).
4. Medusa side: nothing (regions are country-based, not locale-based).
