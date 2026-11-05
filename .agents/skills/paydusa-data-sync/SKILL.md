---
name: paydusa-data-sync
description: Owns the data-flow invariants across the Paydusa stack — Medusa is the SINGLE product source (Medusa→Payload product sync was deleted in a5dab9a, do not recreate it), Algolia indexing is event-driven with folding/idempotent objectID = product.id and published-only, storefront search proxies through Medusa (never direct Algolia keys), the invoice LATEST↔STALE lifecycle, and notification templates must be registered in @paydusa/email. Use for work on search/indexing, product flows, invoices/PDF, order emails or notifications, analytics event tracking, or anything touching Payload editorial vs product data boundaries.
---

# Paydusa Data-Flow Invariants

## 1. Medusa is the sole product source (hard rule)

Commit `a5dab9a` (2026-11-01, BREAKING) deleted the entire Medusa↔Payload product-sync machinery: the `payload` module, `links/product-payload.ts`, `src/api/admin/payload/*`, variant/option subscribers, and all `*-payload-products*` workflows.

- **Never reintroduce Medusa→Payload product sync.** Product data is authored and served by Medusa only.
- Payload keeps **editorial content**: `Pages`, `ReusableContent`, `Posts`, `Media`, `Categories`, `Users`, `Header`/`Footer` globals, SEO/redirects/form-builder plugins.
- The empty leftover dir `apps/medusa/src/modules/payload/` (if still present) must NOT be recreated as a module.
- If a feature seems to need product data in Payload, redesign it to read from Medusa instead (module links, query graph, or a storefront server action).

## 2. Algolia product indexing (event-driven)

Module: `apps/medusa/src/modules/algolia` (`ALGOLIA_MODULE = "algolia"`, `AlgoliaModuleService` — plain class, not `MedusaService`).

- Service API: `indexData(data, type="product")` upserts with **`objectID = item.id`**; `retrieveFromIndex`, `deleteFromIndex`, `search(query, type)`. `AlgoliaIndexType` supports only `"product"`.
- Trigger matrix (all in `apps/medusa/src/subscribers/`):

| Event                                                     | Action                                                                                       |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `product.created`, `product.updated`                      | `syncProductsWorkflow` with `filters: {id}` (single upsert)                                  |
| `product.deleted`                                         | `deleteProductsFromAlgoliaWorkflow` with `ids: [id]`                                         |
| manual: `POST /admin/algolia/sync` → emits `algolia.sync` | `algolia-sync.ts` subscriber pages (limit 50) through `syncProductsWorkflow` (full re-index) |

- Serialization invariant: `sync-products` fetches **published products only** — `status: "published"` with fields `id, title, description, handle, thumbnail, images.*, categories.*, tags.*`. Anything extra a template needs must be added to this field set, not patched client-side after search.
- Never lose the compensating steps: each sync workflow step compensates by restoring prior indexed docs (`retrieveFromIndex` → re-index) or deleting newly-added ids on rollback. Preserve rollback semantics when editing steps.
- **Index settings are NOT configured in code** (no searchableAttributes/facets anywhere). Configure in the Algolia dashboard, or decide deliberately to persist settings in the service before adding facets.

## 3. Storefront search goes through Medusa (no client keys)

- `apps/store/src/lib/config.ts` builds a search wrapper that POSTs to the store's own `/api/search` route.
- `apps/store/src/app/api/search/route.ts` proxies to Medusa `POST /store/products/search` with `x-publishable-api-key`; Medusa resolves `ALGOLIA_MODULE` and calls its `search`.
- **Never ship `ALGOLIA_*` keys to the browser** and never query Algolia directly from store code. Admin key `ALGOLIA_ADMIN_API_KEY` is server-side (medusa) only. If storefront-direct search (react-instantsearch → Algolia) is ever needed, it must use a secured search-only key — a deliberate change, not a shortcut.

## 4. Invoice lifecycle (invoice-generator module)

Module `invoiceGenerator` (`InvoiceGeneratorService extends MedusaService({InvoiceConfig, Invoice})`, loader bootstraps a default config row).

- One `Invoice` per order: `display_id` autoincrement → generated id format `INV-{display_id padded to 6}`; fields `order_id`, `status` (`LATEST`/`STALE`), `pdfContent` (json content cache).
- Flow on `order.placed`: subscriber chains `trackOrderPlaced` → `sendOrderConfirmation` → `generateInvoicePdf`; then `createNotifications({ template: "order-placed" })` attaching the PDF as `invoice-{order.id}.pdf`.
- **Any order mutation** (`order.updated`, `order-edit.confirmed`, `order.exchange_created`, `order.claim_created`, `order.return_received`) calls `markInvoicesStale` — invoice content must reflect the latest order state, so always wire new order-mutating flows to stale-marking.
- `generatePdf` reuses stored non-empty `pdfContent`; regeneration rebuilds via pdfmake (logo fetched and inlined as base64, `Intl.NumberFormat` amounts, country names resolved through a query-graph step in the workflow).
- Steps keep compensations (previous `pdfContent` restored on rollback) — respect when refactoring.

## 5. Notifications & email templates

Provider: `notification-resend` (`Modules.NOTIFICATION` provider in `medusa-config.ts`, options `api_key` + `from`).

- Template names must exist in **`@paydusa/email`**: add template in `packages/email/src/templates/*.tsx`, export it, extend the `EmailTemplate` union and the `emailSubjects` map. A `send` with an unknown template throws.
- Render path: `renderTemplate(template, data)` (react-email `render`) → `resendClient.emails.send`. Optional per-template HTML overrides via provider options (`html_templates`) exist.
- Current triggers: `order.placed` → `order-placed` (+PDF attachment in the subscriber path); `auth.password_reset` → `password-reset` with `{reset_url}` (customer → `storefrontUrl`, admin actor → backend `reset-password?token=…`); `invite.created`/`invite.resent` → `user-invited` with `{invite_url}`.
- Password-reset/invite URL construction depends on `MEDUSA_ADMIN_PATH` (default `/app`) and backend URL config — keep these consistent when changing admin paths.

## 6. Analytics (PostHog via Medusa analytics module)

- `analytics` module registered with the `@medusajs/analytics-posthog` provider.
- Tracking workflows: `track-cart-events` (`cart.item_added`/`item_removed`/`item_updated` → mapped event types), `track-order-placed`, `track-user-events` (`customer.created` → signup). Steps resolve the analytics module and call `track()` with an `anonymousId` fallback.
- New user-behaviour events: add a workflow + subscriber pair following that shape rather than calling analytics ad hoc from services.

## 7. When adding a new sync target

1. New custom module with a service exposing `indexData`/`deleteFromIndex`-style methods (see Algolia module as the reference), registered in `medusa-config.ts` with options from env template vars.
2. Event-driven subscribers for create/update/delete — scope the event payload to `{id}` and re-fetch inside the workflow; never trust event payload as the full record.
3. Workflow steps with compensations; batch operations paginate (see full-resync: limit 50/job).
4. Full-backfill trigger through an admin API route that emits an event through `Modules.EVENT_BUS` (like `/admin/algolia/sync`), not a synchronous rewrite.
