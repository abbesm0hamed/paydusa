# Paydusa Ecommerce Starter: Functional Readiness Plan

## 0. Document contract

```yaml
plan_id: paydusa-functional-readiness
plan_version: 1
created: 2026-11-05
status: proposed
audience: implementation-llms-and-maintainers
scope: reusable-ecommerce-template
assessment: static-source-review
runtime_verification: not-performed
implementation_authorized_by_this_document: false
search_engine_decision: retain-algolia
```

### Objective

Deliver a complete, safe, extensible starting point for a conventional ecommerce store. Every advertised core flow must work, failures must be recoverable, and a new developer must be able to configure and verify the template without discovering hidden stubs.

This is a functional architecture and implementation plan, not a UI redesign, penetration-test report, or instruction to deploy. Creating this document does not authorize implementation, live API calls, migrations against existing databases, provisioning, production changes, or sending customer communications.

### How another LLM must use this plan

1. Read the repository's current `AGENTS.md`, working-tree status, package manifests, and applicable skills before implementation. Preserve unrelated work. Re-open referenced files: this document is a dated snapshot, not a substitute for inspecting current code.
2. Work on one task or a small explicitly requested dependency-complete batch. Do not treat the entire backlog as permission to rewrite the platform.
3. Verify framework APIs against the installed version and official documentation before writing integration code. Some local skills may describe older framework versions.
4. Start each task with a regression test or reproducible failing case. For verification-only findings, investigate first; do not implement a speculative fix.
5. Reuse Medusa's existing commerce workflows and providers. Do not recreate payment orchestration, inventory reservations, taxes, refunds, or order ownership rules in Next.js or Payload.
6. Record changed files, tests executed, exact results, residual risks, configuration changes, and rollback/migration notes. An unexecuted test is not a passing test.
7. If a product decision is unresolved, implement only reversible groundwork and mark the affected acceptance criteria blocked. Do not silently choose merchant policy.
8. Update task status only after its acceptance criteria pass. Keep task IDs stable so later agents can reference them.

### Finding classification

| Label              | Meaning                                                                                                   | Required action                                                            |
| ------------------ | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `SOURCE-CONFIRMED` | The named code pattern or mismatch was inspected. Runtime impact may still need reproduction.             | Add a regression test and fix the confirmed behavior.                      |
| `VERIFY`           | A required property has not been demonstrated, or deployment/framework behavior may provide it elsewhere. | Trace the full path and test before changing anything.                     |
| `BASELINE`         | A required starter capability or documented contract, not necessarily a defect.                           | Implement the minimum coherent default or document the supported boundary. |
| `DECISION`         | Depends on merchant policy, hosting, credentials, or supported product types.                             | Resolve with the maintainer; do not invent the answer.                     |

Security-sensitive source observations are not claims of a demonstrated exploit. Inspect inherited middleware, framework protections, deployment configuration, and actual access before assigning vulnerability severity.

### Priority semantics

- **P0:** Must be addressed or explicitly verified before calling the starter production-ready. Includes correctness, access control, payment safety, and durable processing.
- **P1:** Required for the complete advertised starter baseline.
- **P2:** Optional extensions or optimization beyond the baseline. Do not let these delay P0/P1 correctness.
- Task dependencies mean a shared contract or foundation is needed; tests and investigation should begin immediately rather than waiting until the end.

## 1. Architecture and scope invariants

### Ownership boundaries

| Owner                             | Source of truth                                                                                                                              | Must not own                                                                 |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Medusa (`apps/medusa`)            | Products, variants, prices, sales channels, inventory, carts, promotions, taxes, shipping, payments, customers, orders, fulfillment, refunds | Editorial page publishing or duplicated CMS product records                  |
| Payload, embedded in `apps/store` | Pages, posts, media, navigation, editorial metadata, merchant-configured policy content                                                      | Authoritative prices, stock, payment state, order totals, customer passwords |
| Next.js storefront (`apps/store`) | Presentation, routing, session cookies, SDK integration, request validation, server rendering                                                | A second commerce engine or client-authoritative financial calculations      |
| Algolia                           | Derived, rebuildable discovery index                                                                                                         | Order-time prices, authoritative availability, private customer information  |
| Shared packages                   | Design primitives, email templates, validated configuration contracts                                                                        | Cross-app business state or unscoped secrets                                 |

### Non-negotiable invariants

1. Medusa authorizes commerce operations and calculates final amounts. Client fields, hidden inputs, query parameters, publishable API keys, and random-looking IDs do not establish customer ownership.
2. Medusa monetary values are used in their documented units, not blindly divided or multiplied by 100. Provider-specific conversions belong inside the provider boundary. Use currency precision, including TND's three fractional digits and zero-decimal currencies where supported.
3. Locale, country, Medusa region, currency, sales channel, and authenticated customer are distinct concepts. Define an explicit request-context mapping rather than inferring one from another accidentally.
4. Retries are normal. Core completion uses Medusa's idempotency/locking; custom side effects need their own durable deduplication. Do not promise exactly-once delivery across external systems without evidence.
5. Search and analytics are optional supporting services. Their failures must not corrupt or block authoritative commerce. Email delivery failure must remain visible and retryable without duplicating an order.
6. Private reads must not be shared across customers. Public content must not include drafts or preview credentials. A shared cache tag alone does not prove cache-key leakage: function arguments also participate in cache keys.
7. Production/demo modes must be explicit. A legitimate manual/COD method is not inherently a test method; never mark an unpaid COD order paid just to make checkout succeed.
8. Functional accessibility and resilient forms belong in scope. Adding store-specific visual components, styling systems, or layout redesign does not.

### Deliberately excluded from the mandatory baseline

Wishlists, reviews, loyalty, subscriptions, marketplaces, B2B pricing, product comparison, gift cards, automatic returns approval, recommendations, extra payment gateways, digital-download delivery, and agentic-commerce protocols are optional modules. If an unsupported capability is currently advertised by code or copy, remove the misleading promise or disable it explicitly rather than silently shipping a no-op.

Do not migrate from Algolia to Medusa Search as part of this plan.

## 2. Repository snapshot and strengths to preserve

- Monorepo: `apps/store`, `apps/medusa`, `packages/design-system`, `packages/email`, `packages/env`, and `packages/config`.
- Version declarations at review: Next.js `16.4.3`, Medusa `2.22.1`, Payload `4.0.0-beta.4`, from `pnpm-workspace.yaml`. Reconfirm installed versions before implementation.
- Existing flows include dynamic products/categories/collections, variants, cart mutations, guest-oriented checkout, account login/registration, addresses, order history, order transfer, invoices, Algolia sync, CMS drafts/live preview, localization, storage, and Sentry integration.
- README explicitly establishes Medusa as the sole owner of product data. Preserve this separation.
- Auth/cart cookies already use HttpOnly, production Secure, and SameSite settings. Audit compatibility; do not discard protections to fix a redirect problem.
- Preview entry already verifies a secret and an authenticated Payload user. Preserve these checks while fixing locale/country and content authorization behavior.
- Sentry has deliberate PII-collection restrictions. Preserve and test them rather than assuming observability is absent.
- Database migrations exist. Evolve reviewed migrations safely; do not replace the schema or enable destructive schema push as a shortcut.

## 3. Additional findings beyond the initial review

The first conversation covered access, payments, auth, catalog/promotions, Algolia, email, caching, SEO, post-purchase/privacy, and setup/testing. The following omissions or finer-grained issues were found in the second pass and are included below.

| Finding                                                                                                                                                                       | Classification                                                                              | Task     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------- |
| Invoice validation schema export/import names differ (`PostInvoiceConfgSchema` versus `PostInvoiceConfigSchema`); middleware also mixes `method` and `methods`.               | SOURCE-CONFIRMED name mismatch; VERIFY correct middleware property against installed Medusa | T00      |
| `order-placed` supplies `{ id }` to analytics expecting `{ order_id }`; public add-to-cart analytics supplies `{ id }` instead of `{ cart_id }`.                              | SOURCE-CONFIRMED                                                                            | T09, T18 |
| Address action checks an unawaited cookie promise; completion removes the cart cookie without awaiting; failed completion returns only the cart and loses the returned error. | SOURCE-CONFIRMED                                                                            | T04, T05 |
| New-cart/region-update paths and simultaneous mutations need stale-result and concurrency tests.                                                                              | VERIFY                                                                                      | T04      |
| Quantity choices use a hardcoded inventory limit of ten; add-to-cart rejection can leave its loading state set.                                                               | SOURCE-CONFIRMED                                                                            | T04      |
| Free variants fail a truthiness-based price check; missing prices can become zero during sorting.                                                                             | SOURCE-CONFIRMED                                                                            | T06      |
| Calculated shipping price zero is treated as absent; the shipping loading flag has no reset path when there are no calculated requests.                                       | SOURCE-CONFIRMED                                                                            | T06      |
| Payment session selection differs between the wrapper, payment step, and submit button; rejected/declined paths need terminal loading-state tests.                            | SOURCE-CONFIRMED selection inconsistency; VERIFY resulting behavior                         | T05      |
| Public `/search` currently queries Payload posts, not Algolia products.                                                                                                       | SOURCE-CONFIRMED                                                                            | T08      |
| Order history calls a default limit of ten and discards count metadata, with no pagination path.                                                                              | SOURCE-CONFIRMED                                                                            | T13      |
| Proxy matcher is exported as `proxyConfig`; proxy request reconstruction and dot-path skipping need verification.                                                             | SOURCE-CONFIRMED export; VERIFY framework/runtime effect                                    | T03      |
| Region mapping in `lib/data/regions.ts` has a process-local map with no refresh/eviction path.                                                                                | SOURCE-CONFIRMED                                                                            | T03, T11 |
| Preview generator omits locale/country although preview handler tries to extract locale from the path.                                                                        | SOURCE-CONFIRMED                                                                            | T12      |
| Redirect reference IDs are passed to a helper that searches by slug; reference handling also needs numeric-ID coverage.                                                       | SOURCE-CONFIRMED                                                                            | T12      |
| Scheduled publishing is enabled, but no repository runner configuration was found.                                                                                            | SOURCE-CONFIRMED configuration; VERIFY external runner                                      | T12, T17 |
| Concurrent invoice generation can race through a list-then-create path; legal immutability/revision policy is undefined.                                                      | VERIFY race; DECISION on fiscal policy                                                      | T10      |
| Invoice logo fetching has no explicit timeout/size/host restrictions in the helper. This is admin-configured input, not a demonstrated public SSRF.                           | SOURCE-CONFIRMED resource controls absent locally; VERIFY trust boundary                    | T10      |
| Structured data must be serialized safely when wired into product content; existing helper uses raw `JSON.stringify` inside a script.                                         | BASELINE hardening; helper currently has no discovered product usage                        | T14      |
| Restore drills, provider isolation, policy/version configuration, and human-operable purchase forms were not explicit in the original checklist.                              | BASELINE                                                                                    | T15–T20  |

## 4. Task index and dependency graph

All tasks start **pending**. `T19` is the cross-cutting test/release-gate workstream and starts with T00; it is not permission to defer tests until the last phase.

| ID  | Priority | Deliverable                                                 | Prerequisites                                   |
| --- | -------- | ----------------------------------------------------------- | ----------------------------------------------- |
| T00 | P0       | Reproducible baseline, type coverage, integration contracts | None                                            |
| T01 | P0       | Authorization and public-input boundaries                   | T00                                             |
| T02 | P1       | Complete customer authentication lifecycle                  | T00, T01, T03                                   |
| T03 | P0       | Consistent locale/country/region routing                    | T00                                             |
| T04 | P0       | Reliable cart lifecycle and inventory behavior              | T00, T01, T03                                   |
| T05 | P0       | Safe payment/completion state machine                       | T01, T03, T04, T06                              |
| T06 | P0       | Money, tax, shipping, and promotion correctness             | T00, T03                                        |
| T07 | P1       | Catalog-wide filtering and pagination                       | T01, T03, T06                                   |
| T08 | P1       | Scoped, reliable Algolia search and synchronization         | T01, T03; align query contract with T07         |
| T09 | P0       | Reliable customer notifications                             | T00, T01; coordinate completion events with T05 |
| T10 | P1       | Correct, bounded, concurrency-safe invoices                 | T01, T06                                        |
| T11 | P0       | Cache isolation and freshness contract                      | T00, T01, T03                                   |
| T12 | P1       | CMS publishing, preview, redirects, and scheduling          | T03, T11                                        |
| T13 | P1       | Complete minimum post-purchase journey                      | T01, T02, T05, T09, T10                         |
| T14 | P1       | Technical SEO and machine-readable discovery                | T03, T07, T08, T11                              |
| T15 | P1       | Privacy, consent, retention, and policy integration         | T01, T02                                        |
| T16 | P1       | Repeatable local bootstrap and provider profiles            | T00                                             |
| T17 | P0       | Durable production execution and recovery                   | T00, T01; integrate T09, T12, T16               |
| T18 | P1       | Truthful, non-blocking analytics and observability          | T00, T15                                        |
| T19 | P0       | Automated release gates and failure-path test suite         | Start at T00; final gate covers T01–T18 and T20 |
| T20 | P1       | Explicit starter configuration and extension contracts      | T12, T15, T16                                   |

Suggested implementation waves:

1. **Baseline and test harness:** T00 + initial T19.
2. **Safety/context foundations:** T01, T03, T11, T16; investigate T17 infrastructure requirements.
3. **Money and purchase correctness:** T04, T06, T05; implement T09 without waiting to finish all checkout work.
4. **Discovery and editorial correctness:** T07, T08, T12, T14.
5. **Lifecycle completeness:** T02, T10, T13, T15, T18, T20.
6. **Release verification:** complete T17 and the full T19 matrix.

Independent work may be scheduled separately, but do not change shared contracts concurrently without explicit coordination. This document does not request autonomous subagents.

## 5. Implementation tasks

### T00 — Establish a trustworthy baseline and typed contracts

**Priority:** P0. **Classification:** SOURCE-CONFIRMED + VERIFY. **Owner:** repository tooling and backend contracts.

**Evidence / entry points**

- `apps/medusa/src/api/middlewares.ts` imports `PostInvoiceConfigSchema`, while `apps/medusa/src/api/admin/invoice-config/route.ts` exports `PostInvoiceConfgSchema`.
- Medusa's `package.json` has no `check-types` or test script. Root `check-types` cannot be assumed to cover this package.
- `apps/store/package.json` references `tests/payload-v4-migration.test.mjs`, but the inspected test directory contains only `sentry.test.mjs`.
- `README.md` already lists dependency compatibility gaps; `pnpm-workspace.yaml` pins Payload beta and coordinated framework families.

**Implementation**

1. Record clean-install, type-check, lint, build, and existing-test results before fixes. Separate pre-existing failures from new regressions.
2. Resolve schema export/import mismatches and verify middleware configuration names using the installed framework. Do not rename schema exports without updating every consumer.
3. Add explicit backend type coverage, including workflow inputs/subscriber payloads and custom routes. Prevent unsafe assertions from hiding incompatible inputs.
4. Repair or intentionally retire stale test/lint scripts. Do not retain green-looking commands that skip the relevant package.
5. Choose a tested dependency baseline; isolate framework migrations from functional repairs. Do not mass-upgrade or downgrade dependencies merely to silence peers.
6. Establish a minimal reusable API/integration test harness now, expanded under T19.

**Acceptance**

- `T00-A`: A documented fresh install produces reproducible baseline results; every failing gate has an owned issue/task.
- `T00-B`: Backend type checks fail on an incorrect workflow input key or missing exported schema.
- `T00-C`: Every advertised test command points to real tests; builds do not ignore TypeScript failures.

### T01 — Define authorization, guest access, and input boundaries

**Priority:** P0. **Classification:** SOURCE-CONFIRMED local omissions + VERIFY inherited protections. **Owner:** Medusa API/workflows and Next.js request boundaries.

**Evidence / entry points**

- `apps/medusa/src/api/store/orders/[id]/invoices/route.ts` accepts an order ID; `apps/medusa/src/workflows/generate-invoice-pdf.ts` loads that order without a customer/guest-access argument.
- `apps/medusa/src/api/middlewares.ts` does not explicitly protect that custom route with a customer ownership policy.
- `apps/medusa/src/api/store/analytics/route.ts` accepts event properties including caller-supplied customer/cart IDs without a local discriminated schema.
- `apps/store/src/app/api/search/route.ts` returns backend error details; `apps/medusa/src/api/test-sentry/route.ts` is an intentional error endpoint.

**Implementation**

1. Inventory public, customer-only, guest-capability, and staff endpoints. Trace default middleware before concluding that any route is publicly accessible.
2. Enforce authenticated customer ownership in workflow/service authorization steps, not only UI. Use supported Medusa authentication middleware and server-derived identity.
3. Define secure guest order/invoice access: prefer supported framework mechanisms; if insufficient, use a short-lived, order-scoped signed capability or email-verification flow. Order ID plus typed email is not proof of identity.
4. Do not accidentally break legitimate guest confirmation. Document authorization for confirmation, subsequent lookup, invoice download, transfer, and support requests separately.
5. Validate allowed input fields, query lengths, pagination bounds, integer quantities, identifier formats, and event discriminants. Never trust client totals, status, identity, or an arbitrary `cartId` passed to a Server Action as ownership.
6. Add configurable, distributed abuse limits for login/reset, public forms, search, guest lookup, and expensive PDF generation. Keep browse/product pages readable; do not blanket-CAPTCHA the store.
7. Standardize safe error responses with request IDs; retain internal diagnostics server-side. Disable or explicitly guard diagnostic routes outside development.
8. Audit CMS admin/editor permissions, media/form-submission access, cron execution access, and custom admin routes. Distinguish CMS staff from Medusa customers.

**Acceptance**

- `T01-A`: Anonymous, owner, different customer, staff, valid guest capability, expired capability, and altered order ID have explicit expected outcomes.
- `T01-B`: Unauthorized requests cannot generate a PDF, mutate an order, transfer ownership, or expose customer addresses.
- `T01-C`: Malformed/oversized requests fail predictably; rate limits are observable and do not bypass provider webhooks or trusted workers accidentally.
- `T01-D`: No private response is publicly cached; errors contain no credentials, raw provider bodies, or reset/guest tokens.

### T02 — Complete account creation, recovery, and session lifecycle

**Priority:** P1. **Classification:** SOURCE-CONFIRMED + BASELINE. **Owner:** storefront auth and Medusa auth integration.

**Evidence / entry points**

- `apps/store/src/modules/account/components/profile-password/index.tsx` only displays an unimplemented toast.
- `apps/medusa/src/subscribers/password-reset.ts` emits `/reset-password` links; no corresponding customer storefront route was found.
- `apps/store/src/lib/data/customer.ts`, `apps/store/src/lib/data/cookies.ts`, and `apps/store/src/modules/account/components/login/index.tsx` implement the current lifecycle.

**Implementation**

1. Add forgot/reset password and authenticated password change using supported Medusa auth APIs. Encode URL parameters and use a validated storefront origin plus correct locale/country.
2. Handle invalid, expired, already-used, and revoked tokens without exposing account existence. Document framework-supported session revocation guarantees; do not claim token single-use if the provider does not enforce it.
3. Validate registration/profile data server-side. Handle partial signup failure between auth registration and customer creation, and cart-transfer failure after successful login.
4. Define email-change/reverification policy, reauthentication for sensitive changes, token expiry/refresh behavior, and logout semantics. Email verification remains configurable.
5. Define guest-to-account association and existing-cart behavior using Medusa transfer semantics. Do not merge another person's cart or attach historical guest orders by an unverified email match.

**Acceptance**

- `T02-A`: A customer can register, sign in, recover access, change a password, and sign out in each supported locale.
- `T02-B`: Expired sessions preserve recoverable cart contents without leaking the prior account's data.
- `T02-C`: Wrong/expired tokens and partial signup/login failures produce actionable errors without false success.
- `T02-D`: Account/cart association requires demonstrated authority and survives a retry safely.

### T03 — Unify routing, locale, country, and region context

**Priority:** P0. **Classification:** SOURCE-CONFIRMED + VERIFY. **Owner:** Next.js routing and Medusa region integration.

**Evidence / entry points**

- `apps/store/src/proxy.ts` exports `proxyConfig`, reconstructs a request from a redirect URL, and skips every pathname containing a dot.
- `apps/store/src/lib/data/cart.ts` address submission redirects to `/{country}/checkout` without the locale.
- `apps/store/src/lib/data/regions.ts` uses a non-expiring process-local country map and a hardcoded `tn` fallback.
- `apps/store/src/modules/common/components/localized-client-link/index.tsx`, `apps/store/src/i18n/routing.ts`, and `apps/store/src/i18n/localization.ts` provide existing context helpers.

**Implementation**

1. Document one canonical `/{locale}/{countryCode}/...` route contract and shared validated URL builders for links, actions, emails, previews, metadata, and redirects. Separate internal paths from external URLs.
2. Verify the installed Next.js proxy export/matcher contract. Preserve request cookies, headers, and query parameters across normalization; test already-canonical paths and handles containing dots.
3. Prefer explicit user/URL choice over IP detection. Define a deterministic root/default-market behavior, fallback for unsupported countries/locales, and bounded redirect chains. Do not introduce a competing root route implicitly.
4. Validate country-to-region membership from Medusa. Do not invent a region ID when the backend is unavailable; distinguish a routing fallback from a purchasable region.
5. Make market switches reconcile cart region, currency, prices, promotions, addresses, shipping options, and payment sessions. Prevent an old region response from overwriting the newest selection.
6. Test SameSite cookie behavior on external payment returns and email links. If adjustments are required, use the narrowest compatible cookie policy with origin/CSRF protection, not a blanket weakening.

**Acceptance**

- `T03-A`: Direct loads, refresh, query parameters, search clicks, login, checkout steps, confirmation, and email links retain the intended locale/market.
- `T03-B`: No redirect loop, duplicate path prefix, invented region ID, or lost cart/session cookie occurs.
- `T03-C`: A removed/changed Medusa region refreshes within the documented freshness bound in every instance.
- `T03-D`: Switching market during checkout cannot complete using stale currency, shipping, or payment context.

### T04 — Make the cart resilient and inventory-aware

**Priority:** P0. **Classification:** SOURCE-CONFIRMED + VERIFY concurrency. **Owner:** cart actions, product actions, and Medusa cart integration.

**Evidence / entry points**

- `apps/store/src/lib/data/cart.ts`: unawaited `getCartId()` in `setAddresses`; unawaited `removeCartId()` on success; broad retrieval failures become null; region update can return the previously retrieved cart.
- `apps/store/src/modules/cart/components/item/index.tsx` uses a hardcoded maximum of ten and duplicates a quantity-one option.
- `apps/store/src/modules/products/components/product-actions/index.tsx` resets loading only after a successful add.

**Implementation**

1. Await cookie operations and return the updated authoritative cart after region changes. Distinguish a genuinely missing/completed cart from backend/network failure before creating a replacement.
2. Handle simultaneous first adds, rapid quantity edits, duplicate clicks, multiple tabs, expired cart cookies, deleted/unpublished variants, and login/market changes. Define last-write behavior rather than trusting response arrival order.
3. Derive usable quantity constraints from supported Medusa availability and merchant purchase-limit configuration. Inventory checks in the browser are advisory; Medusa remains authoritative at mutation/completion time.
4. Handle backorders and unmanaged stock without a false ten-item inventory cap. Reject invalid/negative/non-integer quantities server-side.
5. Preserve checkout fields, including address line two, through form submission and validation errors. Do not impose one country's postal/state rules globally.
6. Ensure every async mutation clears pending state on success/failure and exposes a recoverable error. Use optimistic rollback only where correct.
7. Provide named, keyboard-operable controls and progressively enhanced add-to-cart forms. Use the existing design language; do not redesign the PDP.

**Acceptance**

- `T04-A`: Two simultaneous initial adds do not lose an item or leave inaccessible orphan carts without a defined recovery path.
- `T04-B`: Rapid edits and stale responses converge to the documented cart state; failed mutations preserve recoverable data.
- `T04-C`: Last-unit competition produces at most the inventory allocation Medusa permits; the losing customer receives an actionable refresh/reselection path.
- `T04-D`: Cart cookies clear only after an actual order, and a reload no longer displays the completed cart.
- `T04-E`: Add-to-cart rejection resets loading; quantity controls correctly support stock below ten, above ten, unmanaged stock, and backorders.

### T05 — Complete the payment and order-completion state machine

**Priority:** P0. **Classification:** SOURCE-CONFIRMED + VERIFY provider behavior. **Owner:** Medusa payments and storefront checkout.

**Evidence / entry points**

- `apps/medusa/medusa-config.ts` does not register Stripe; `apps/medusa/src/scripts/seed.ts` selects the system/manual provider.
- `apps/store/src/modules/checkout/components/payment-button/index.tsx` selects the first session for provider dispatch but later finds a pending session; wrapper/payment step use different selection rules.
- `apps/store/src/lib/data/cart.ts` returns `cartRes.cart` on unsuccessful completion without preserving its error details.
- `apps/store/src/modules/checkout/components/payment/index.tsx` and `review/index.tsx` contain gift-card-specific zero-total logic despite no working gift-card actions.

**Implementation**

1. Ship one explicit demo mode and one documented working Stripe sandbox profile, enabled only with validated configuration and regional provider assignments.
2. Use the official provider's webhook route/signature handling and core completion logic. Do not introduce a second webhook consumer or automatic frontend refund routine without a demonstrated gap in the installed provider.
3. Specify states for selecting a method, creating/replacing a session, collecting details, additional authentication, authorizing, completing, failure, and already-completed recovery. Use a single active-session selection contract.
4. Handle declined cards, cancelled authentication, browser/network interruption, return navigation, stale sessions after totals change, repeated webhooks, and multiple submissions.
5. Interpret the completion response discriminator and error. Provider success alone is not an order confirmation. Core Medusa handles supported compensation; preserve that behavior instead of independently issuing a refund.
6. Support legitimate zero-total carts through the installed engine's completion rules without demanding a card or pretending a gift card exists. Distinguish demo/manual/COD behavior and payment status truthfully.
7. Verify core idempotency/locking under concurrent completion. Make custom steps idempotent; do not wrap the entire engine in a parallel payment/order database.

**Acceptance**

- `T05-A`: Demo and Stripe sandbox purchases each create one order with matching cart/currency/amount and correct payment state.
- `T05-B`: Decline, authentication cancel, unexpected provider error, and completion failure always terminate pending UI state and allow safe retry.
- `T05-C`: Refresh, duplicate submit, browser return, and duplicated/reordered webhook events do not create duplicate orders or unintended charges/refunds.
- `T05-D`: Zero-total and configured manual/COD orders complete with correct state; unsupported providers are unavailable rather than dead-end choices.
- `T05-E`: A payment/completion failure follows verified installed Medusa compensation behavior and is diagnosable without customer tokens in logs.

### T06 — Enforce money, tax, shipping, and promotion correctness

**Priority:** P0. **Classification:** SOURCE-CONFIRMED + BASELINE. **Owner:** financial display/integration contracts; Medusa remains calculation owner.

**Evidence / entry points**

- `apps/store/src/lib/util/get-product-price.ts` rejects a calculated amount of zero using truthiness.
- `apps/store/src/lib/util/sort-products.ts` converts a missing calculated amount to zero.
- `apps/store/src/lib/util/get-precentage-diff.ts` divides by the original price without a zero guard.
- `apps/store/src/modules/checkout/components/discount-code/index.tsx` retains undefined codes instead of defined existing promotion codes; displayed error state is not wired to the form action actually submitted.
- `apps/store/src/modules/checkout/components/shipping/index.tsx` uses truthiness for calculated prices and can leave price loading true when there are no requests.
- `apps/store/src/lib/util/money.ts` defaults to `en-US`; some order shipping display manually rewrites punctuation.

**Implementation**

1. Define valid-zero versus unavailable price explicitly. Unpriced variants must not masquerade as free or win cheapest-price sorting.
2. Format with the active locale and currency precision, never manual comma/period substitution. Handle zero original price without NaN/Infinity discount labels.
3. Preserve other applied codes when adding/removing a promotion; distinguish automatic promotions; connect validation failures to the actual action result.
4. Recalculate through Medusa after quantity, address, region, shipping, or promotion changes. Test inclusive/exclusive tax, shipping tax, free shipping, rounding, and expired/usage-limited promotions.
5. Treat calculated shipping zero as free; always settle loading state; disable unavailable quotes and reject stale quotes when cart context changes.
6. Compare product/cart/review/order/email/invoice amounts using authoritative data. Support multiple shipping lines in totals instead of assuming the first one represents the complete charge.
7. Document tax-provider setup as a merchant requirement. A demo tax seed is not proof of jurisdictional compliance.

**Acceptance**

- `T06-A`: Free, missing-price, discounted, and original-price-zero fixtures produce correct labels and filter behavior.
- `T06-B`: EUR/USD/TND and a supported zero-decimal currency format/round correctly; payment-provider boundaries preserve exact intended amounts.
- `T06-C`: Adding/removing one code does not unintentionally remove another; invalid codes produce a recoverable error.
- `T06-D`: Address/market changes update tax/shipping/payment totals, with matching order, email, and invoice totals.
- `T06-E`: Flat, calculated, free, failed, and no-available shipping quotes settle predictably; no infinite loader or accidental free fallback.

### T07 — Make catalog queries correct beyond demo data

**Priority:** P1. **Classification:** SOURCE-CONFIRMED. **Owner:** catalog query API and storefront listings.

**Evidence / entry points**

- `apps/store/src/lib/data/products.ts` fetches 100 products and sorts/filters/paginates that subset in memory; API errors become empty results.
- `apps/medusa/src/api/store/product-filters/route.ts` builds option counts from 100 products with no explicit local sales-channel scoping.
- `apps/store/src/modules/store/templates/paginated-products.tsx` and listing/category/collection callers consume these results.

**Implementation**

1. Define a bounded query contract for filters, sort, page/cursor, region, and channel. All filtering/sorting must apply to the eligible catalog before pagination.
2. Evaluate installed Medusa query/index capabilities versus Algolia-derived discovery. Use supported backend queries or Algolia for catalog-wide selection; do not simply raise 100 to a larger cap or scan the entire catalog per request.
3. If Algolia determines IDs/order, rehydrate and validate eligible products through Medusa. Preserve ordering and document index freshness; do not expose customer-specific pricing in a public index.
4. Return total/count and pagination metadata accurately; define stable tie-breaking and valid behavior for out-of-range/malformed pages.
5. Compute facets in the appropriate query scope. Custom endpoints must respect published status and publishable-key sales channels, not just status.
6. Preserve filters in URLs and distinguish upstream failure from a genuine empty catalog.

**Acceptance**

- `T07-A`: With at least 250 products, an eligible product beyond the original first 100 can be found, filtered, sorted, and paginated correctly.
- `T07-B`: Stable ordering, counts, combined filters, category/collection constraints, and facet counts agree across pages.
- `T07-C`: A second sales channel and market do not reveal ineligible products or cross-currency prices.
- `T07-D`: Backend outage yields an explicit error/retry, not a false empty collection or product 404.

### T08 — Keep Algolia and make discovery coherent

**Priority:** P1. **Classification:** SOURCE-CONFIRMED + BASELINE. **Owner:** Algolia integration, sync workflows, search routes.

**Evidence / entry points**

- `apps/medusa/src/modules/algolia/service.ts` does not await `saveObjects()` inside `indexData()`.
- `apps/medusa/src/workflows/sync-products.ts` selects published records only; `subscribers/product-updated.ts` does not delete a previously indexed product on unpublish and logs/swallow failures.
- `apps/store/src/lib/config.ts` forwards only query text and falls back to empty results for malformed/error responses.
- `apps/store/src/app/api/search/route.ts` adds a Next.js-to-Medusa hop; backend then calls Algolia. Do not assume this is a measured performance problem.
- `apps/store/src/modules/search/components/modal/index.tsx` uses unprefixed product links.
- `apps/store/src/app/[locale]/[countryCode]/(main)/search/page.tsx` searches the Payload posts index, not products.

**Implementation**

1. Keep Algolia as the selected engine. Define one product discovery contract for quick search and a shareable GET results page. Keep editorial search separately named or explicitly grouped; do not delete it accidentally.
2. Make index writes awaitable and observable; distinguish request acceptance from task completion using supported Algolia task semantics where required.
3. On update, evaluate index eligibility and explicitly delete ineligible records. Cover publish/unpublish/delete and relevant category/tag/variant changes; verify emitted Medusa event names/payloads.
4. Add retries, durable job visibility, a safe reconciliation/rebuild path, stale-event protection, and environment-specific index naming. Use staged rebuild/swap if supported; do not clear the live index first.
5. Enforce channel/market visibility server-side. Index only whitelisted discovery fields; never send admin keys, customer prices, or private metadata to the browser.
6. Support bounded pagination/filter/sort parameters actually advertised by the UI. URL-encode queries, preserve locale/country, and surface provider failures separately from no results.
7. Debounce typing, cancel/ignore stale searches, preserve valid previous results, and avoid empty-query catalog flashes. Link a chosen product to its PDP; Enter opens results rather than guessing a product redirect.
8. Measure end-to-end latency and each hop with reproducible queries before optimizing transport. A browser Algolia client, if ever chosen, requires a deliberately scoped search-only key and verified data visibility.

**Acceptance**

- `T08-A`: Create/update/unpublish/republish/delete cycles converge correctly; retry/reconciliation restores state after injected Algolia failures.
- `T08-B`: Product GET search returns server-rendered product links; editorial results remain intentionally accessible.
- `T08-C`: Fast typing cannot display an older response as the newest query; no provider failure is labeled no-results.
- `T08-D`: Results preserve locale/country and channel eligibility, including a product shared by some but not all channels.
- `T08-E`: Preview/local bulk sync cannot modify the production index; admin credentials never appear in client artifacts.

### T09 — Make notifications retryable and independent

**Priority:** P0. **Classification:** SOURCE-CONFIRMED. **Owner:** Medusa subscribers, notification provider, shared email templates.

**Evidence / entry points**

- `apps/medusa/src/subscribers/order-placed.ts` calls confirmation workflow and then a second `order-placed` notification, with different data shapes.
- The subscriber supplies analytics `{ id }`; `apps/medusa/src/workflows/track-order-placed.ts` expects `{ order_id }` and is awaited before email work.
- Invoice attachment is converted to a string of binary digits, while `apps/medusa/src/modules/resend/service.ts` ignores `notification.attachments` entirely.
- The provider returns `{}` on template/render/send errors, potentially hiding failure from retry handling.
- `packages/email/src/index.tsx` declares confirmation, password reset, and invitation templates only.

**Implementation**

1. Fix workflow input contracts and standardize typed template data. One event should trigger one intended confirmation path, with optional invoice attachment or secure download link.
2. Separate optional analytics from essential communications. Invoice rendering failure must not silently suppress the order receipt; use a documented delayed-invoice path when necessary.
3. Forward attachments using verified Medusa/Resend content contracts; enforce size limits and avoid invalid binary-string encoding.
4. Surface retryable provider failures; dead-letter or explicitly record permanent invalid recipient/template failures. Persist deduplication keys using event/order/channel/template version as appropriate.
5. Use provider idempotency if available and supported; document the crash window where delivery status is unknown. Do not claim a database flag alone gives exactly-once external email.
6. Add configurable shipment, cancellation, and refund notifications derived from actual Medusa lifecycle events. Keep locale, URLs, branding, and sender configuration consistent.

**Acceptance**

- `T09-A`: One placed order sends one intended confirmation with the correct shape and valid attachment/link.
- `T09-B`: Analytics outage does not block the receipt; mail outage is visible, retryable, and does not create a second order.
- `T09-C`: Duplicate event delivery and restart/retry behavior have tested deduplication semantics and documented ambiguous-send recovery.
- `T09-D`: Password-reset/invitation links point to the correct environment and contain no malformed/unencoded query data.

### T10 — Make invoices safe, accurate, and concurrency-aware

**Priority:** P1; access protection is P0 in T01. **Classification:** SOURCE-CONFIRMED + VERIFY + DECISION. **Owner:** invoice module/workflows.

**Evidence / entry points**

- `apps/medusa/src/workflows/steps/get-order-invoice.ts` lists the latest invoice, then creates one if missing; no local concurrency protection was found.
- `apps/medusa/src/modules/invoice-generator/models/invoice.ts` has no visible latest-per-order uniqueness constraint.
- `apps/medusa/src/subscribers/order-updated.ts` marks invoices stale after several events; the fiscal meaning of reissuing is not defined.
- `apps/medusa/src/modules/invoice-generator/service.ts` assumes the first shipping method total, uses a fixed locale/font, and fetches an admin-configured logo with unrestricted `axios.get` options.

**Implementation**

1. Establish whether this is a sample receipt/PDF or a jurisdiction-compliant fiscal invoice. Document merchant responsibilities; do not claim global legal compliance.
2. Make generation idempotent per order/revision using supported locking and a durable database invariant, with a reviewed migration and collision recovery.
3. Derive all lines/totals from the appropriate order snapshot, including multiple shipping lines, discounts, taxes, and currency precision. Test long names, pagination, and supported localized characters/fonts.
4. Define immutable issued records, revisions, cancellation/refund/credit-note policy as required. Do not silently overwrite an issued fiscal document when product data or company settings change.
5. Bound PDF generation cost and logo retrieval: timeout, response size, content type, redirect behavior, and trusted media origin/storage references. Verify the admin trust boundary; do not label it a confirmed public SSRF.
6. Await cleanup/compensation operations, restrict access via T01, and avoid regenerating expensive documents on every read unnecessarily. If a GET creates records, make this behavior bounded/idempotent and document it or move generation to a command path.

**Acceptance**

- `T10-A`: Concurrent generation/repeated event handling yields one valid current document per defined revision.
- `T10-B`: Item/shipping/tax/discount/grand totals match the authoritative order fixtures.
- `T10-C`: Remote-image failure cannot hang workers indefinitely; malformed/oversized content fails safely.
- `T10-D`: Revisions/retention behavior is explicit and preserves required history; Arabic/French/English content follows the supported font/locale contract.

### T11 — Define cache isolation and freshness guarantees

**Priority:** P0. **Classification:** SOURCE-CONFIRMED + VERIFY. **Owner:** storefront data layer and CMS revalidation.

**Evidence / entry points**

- `apps/store/src/lib/data/customer.ts` tags reads `customers`; mutations invalidate `customers-${cacheId}` from `cookies.ts`.
- Cart/order helpers use force-cache and session-derived tags; external fulfillment/refund changes do not originate in these actions.
- `apps/store/src/collections/Pages/hooks/revalidatePage.ts` invalidates paths without locale/country. Cached CMS page reads and `getDocument.ts` use different tagging patterns.
- `apps/store/src/lib/data/regions.ts` adds an independent non-expiring in-process map above framework caching.

**Implementation**

1. Write a cache matrix: resource, public/private scope, key inputs, TTL, mutation invalidation, external-event invalidation, and failure behavior.
2. Prefer request-scoped/no-store handling for sensitive mutable account/cart data unless a demonstrated safe cache design is needed. Do not leak auth headers/tokens through logs, diagnostics, or client props.
3. Align every cache writer and invalidator; never invalidate an empty tag. Apply installed Next.js read-your-own-writes versus stale-while-revalidate semantics intentionally.
4. Define bounded order-status freshness and CMS publish/unpublish/delete/slug-change invalidation across locale/country variants. Authenticate any webhook-driven revalidation; constrain invalidation targets.
5. Isolate draft/preview reads from publicly reusable cache entries and re-check read authorization where required. Test multiple editors/locales, not just preview entry.
6. Remove or correctly expire redundant process-local caches; document multi-instance cache invalidation behavior.

**Acceptance**

- `T11-A`: Updating a profile/address/cart is visible immediately according to the documented consistency contract.
- `T11-B`: Two customer sessions, anonymous browsing, and preview/public reads cannot contaminate each other's results.
- `T11-C`: Publish/unpublish/rename/delete and external order-status changes become visible within a specified, tested bound across instances.
- `T11-D`: Backend outage is not cached as a permanent empty state or used to create a replacement cart accidentally.

### T12 — Complete the editorial publishing lifecycle

**Priority:** P1. **Classification:** SOURCE-CONFIRMED + VERIFY runtime runner. **Owner:** Payload integration and storefront content routing.

**Evidence / entry points**

- `apps/store/src/utilities/generatePreviewPath.ts` builds `/slug` paths, while `app/next/preview/route.ts` extracts locale from the first segment.
- `apps/store/src/components/PayloadRedirects/index.tsx` passes a reference ID to `getCachedDocument`, whose `apps/store/src/utilities/getDocument.ts` implementation searches `slug`.
- `apps/store/src/collections/Pages/index.ts` enables scheduled publishing. `apps/store/src/payload.config.ts` has no explicit runner configuration in the inspected source.
- Payload v4 is in use; v3 access-control defaults must not be assumed.

**Implementation**

1. Generate preview paths from validated collection, locale, country, and slug; allowlist previewable collections and preserve authenticated entry checks. Keep secrets out of public metadata/cache/logs.
2. Resolve references by actual ID type using supported Local API methods. Handle both populated and unpopulated numeric/string references, locale, missing documents, and redirect loops.
3. Preserve permanent versus temporary redirect intent, slug-change behavior, and validated external redirect destinations. Do not turn editorial redirect data into an arbitrary public redirect command.
4. Demonstrate draft, publish, scheduled publish/unpublish, rollback, and preview exit. Configure a persistent runner or authenticated external scheduler suitable for the deployment; a schedule toggle alone does not execute jobs.
5. Test localized publishing/fallback policy, role permissions, and public access to related content/media. Keep commerce entities in Medusa; CMS commerce references should be identifiers with safe missing/deleted-target behavior.

**Acceptance**

- `T12-A`: Each supported locale/market previews its own draft while anonymous visitors see published content only.
- `T12-B`: Exiting preview restores public content; stale draft caches are not observable publicly.
- `T12-C`: Reference-based redirects work with real Payload IDs, preserve intended context/status, and detect loops/missing targets.
- `T12-D`: A scheduled change executes after a runner restart and invalidates the correct public routes.

### T13 — Finish the minimum post-purchase journey

**Priority:** P1. **Classification:** SOURCE-CONFIRMED + BASELINE + DECISION. **Owner:** order account/guest flows and Medusa operations.

**Evidence / entry points**

- `apps/store/src/lib/data/orders.ts` defaults to ten orders and returns only the array, dropping pagination/count metadata.
- `apps/store/src/app/[locale]/[countryCode]/(main)/account/@dashboard/orders/page.tsx` calls that default with no paging controls/parameters and advertises returns/exchanges.
- `apps/store/src/modules/order/components/shipping-details/index.tsx` shows basic delivery details; installed fulfillment/tracking fields need verification before extending reads.

**Implementation**

1. Add stable, authorized order history pagination and fresh order details with payment, fulfillment, tracking, cancellation, and refund states.
2. Provide the T01-defined secure guest lookup/access flow and verified order-transfer/account association. Handle completed orders whose cart cookie no longer exists.
3. Offer a minimum configurable support/cancel/return request path. A staff-managed request is sufficient; do not imply that submitting a request approves a return, cancels fulfillment, or issues a refund.
4. Use Medusa's supported administrative workflows for cancellation/returns/refunds. Apply policy eligibility and idempotency; do not build a duplicate order state machine in Payload.
5. Reconcile customer-visible status with asynchronous fulfillment/refund notifications and document partial fulfillment/refund behavior. Remove promises for capabilities that remain disabled.

**Acceptance**

- `T13-A`: A customer with over 20 orders can reach every order without cross-customer access.
- `T13-B`: A guest can securely revisit an order and invoice, and transfer it only through verified authority.
- `T13-C`: Partial/full shipment, cancellation, and refund statuses display truthfully within the cache freshness bound.
- `T13-D`: Repeated support/return requests do not cause unintended duplicate refunds or cancellation actions.

### T14 — Implement technical SEO and durable discovery

**Priority:** P1. **Classification:** SOURCE-CONFIRMED + BASELINE. **Owner:** metadata routes, public server rendering, and structured data.

**Evidence / entry points**

- `apps/store/src/app/[locale]/[countryCode]/sitemap.ts` reads missing `www` and constructs incomplete route shapes.
- Robots metadata lives beneath locale/country; root `/robots.txt` reachability must be checked rather than assumed.
- Existing CMS sitemap routes omit locale/country and product coverage. Product static-param generation only enumerates 100 records per country; this alone does not prove other dynamic URLs are unavailable.
- `apps/store/src/lib/seo/json-ld.tsx` is not wired into discovered product pages and serializes JSON without explicit script-safe escaping.

**Implementation**

1. Serve root robots and sitemap index correctly; generate paginated/chunked product, category, collection, and published-content sitemap entries using the actual locale/market URL contract.
2. Add canonical/hreflang rules for valid locale/market combinations and a defined variant/filter URL policy. Avoid indexing arbitrary query permutations or preview/account/checkout/order pages.
3. Add server-rendered Product/Offer or ProductGroup data as appropriate, using the same visible price/currency/availability source. Include factual identifiers only; do not invent ratings, GTINs, brand, shipping promises, or return policies.
4. Serialize script data safely, including `<`/script-termination sequences; support multiple schema blocks with stable distinct identifiers.
5. Verify product name, price/currency, stock state, links, and GET search results in server HTML, not only hydration payloads. Use T04's progressively enhanced forms; respect user choice and legal requirements for crawler access rather than hardcoding all bot policy.
6. Distinguish actual unknown/unpublished products (404) from backend failures (error/retry). Protect non-production environments with appropriate indexing controls; robots is not access control.

**Acceptance**

- `T14-A`: Root robots points to reachable sitemap files containing valid published product/content URLs beyond the first 100 records.
- `T14-B`: Canonicals/alternates resolve consistently and private/preview routes are not submitted for indexing.
- `T14-C`: Structured data validates, matches visible regional prices, and cannot terminate its script through catalog/CMS strings.
- `T14-D`: HTTP/server-HTML checks show useful product/search content, genuine missing products are 404, and API outages are not converted into false 404s.

### T15 — Define privacy, consent, retention, and policy behavior

**Priority:** P1; immediate abuse controls are in T01. **Classification:** BASELINE + DECISION. **Owner:** merchant policy, CMS configuration, data-processing boundaries.

**Evidence / entry points**

- `apps/store/src/modules/checkout/components/review/index.tsx` has generic policy-acceptance copy rather than an explicit configurable policy contract.
- `apps/medusa/src/subscribers/analytics-user-events.ts` forwards email/name fields; `apps/medusa/src/api/store/analytics/route.ts` trusts supplied identity properties.
- `apps/store/src/lib/sentry-options.ts` already limits PII collection; preserve it.
- `apps/store/src/plugins/index.ts` enables public form submissions; operational retention and abuse controls need verification.

**Implementation**

1. Configure actual policy document references/versions and merchant contact details. Record policy acceptance only where legally/operationally required; do not invent universal checkbox requirements or legal text.
2. Define essential operational processing versus optional analytics/marketing by deployment region. Disable optional tracking by default until configured lawfully; consent withdrawal must affect future optional tracking.
3. Minimize identity fields and derive authenticated identity server-side. Never export card details, tokens, raw reset URLs, or unnecessary addresses through telemetry.
4. Define verified data-access/export and deletion/anonymization request handling across Medusa, Payload forms, storage, analytics, and email providers. Retain financial records where required; do not hard-delete orders automatically.
5. Document retention periods as merchant decisions, service subprocessors, audit trails, and access-controlled request processing. Include rate-limited human support as a valid baseline instead of requiring a full self-service privacy platform.

**Acceptance**

- `T15-A`: Optional analytics is off before applicable consent/configuration and stops after withdrawal; essential receipts still work.
- `T15-B`: A verified privacy request follows documented retention/legal-hold rules without exposing another customer's data.
- `T15-C`: Token, password, payment-secret, address, and form-submission leakage tests cover logs/events/errors.
- `T15-D`: Checkout links/acceptance records reference real configured policy documents; demo text is unmistakably non-legal sample content.

### T16 — Provide repeatable bootstrap and optional service profiles

**Priority:** P1. **Classification:** SOURCE-CONFIRMED + BASELINE. **Owner:** developer experience, environment configuration, seeds.

**Evidence / entry points**

- `packages/env/src/server.ts` validates only a small subset of configuration; `web.ts` has no client schema.
- `apps/medusa/medusa-config.ts` registers external Algolia, Resend, PostHog, and S3-compatible storage; local behavior with missing credentials is not demonstrated.
- `docker/db-setup.sh` runs migrations and swallows seed/admin-user failures as possibly already complete; shell availability of `MEDUSA_ADMIN_PASSWORD` needs verification because the README directs configuration to an app env file.
- README setup wording is inconsistent about resetting versus creating/migrating existing databases.

**Implementation**

1. Define explicit local-demo, sandbox-integration, test, preview, and production profiles. Optional service-disabled modes must be honest: no fabricated successful sends/searches or silent dropped jobs.
2. Validate each app's required variables and provider-specific groups, origins, secrets, and public/server separation. Fail early with variable names, never values. Ensure Turbo passes required build/runtime variables explicitly.
3. Supply local email capture/dev notification behavior, storage defaults or documented local setup, and a search-disabled/fallback contract that preserves basic catalog browsing when Algolia is not configured.
4. Make bootstrap non-destructive by default and repeatable. Separate migrate, seed, and explicit reset commands. Never swallow unknown seed/migration failures as success.
5. Use supported non-interactive migration flags after verification; do not pipe automatic yes into destructive operations. Load app configuration deliberately in scripts without printing secrets.
6. Seed deterministic representative fixtures, an intended admin role, and publishable-key/channel linkage. Do not assume fixed IDs or leave default production credentials.

**Acceptance**

- `T16-A`: Fresh clone plus documented setup reaches a working demo purchase with no unintended external emails or production writes.
- `T16-B`: Running setup twice is safe and does not duplicate core data, change keys unexpectedly, or hide errors.
- `T16-C`: Missing enabled-provider credentials produce clear errors; disabled optional services do not prevent unrelated core flows.
- `T16-D`: Configuration is isolated per app/environment; no secret is embedded in client artifacts or committed by setup.

### T17 — Make production events, workers, and restoration durable

**Priority:** P0. **Classification:** SOURCE-CONFIRMED configuration + VERIFY hosting. **Owner:** deployment architecture and operations.

**Evidence / entry points**

- `apps/medusa/medusa-config.ts` explicitly configures Redis workflow engine but not a visible production event-bus/locking/cache topology. The option uses `redis.url`; verify supported/deprecated keys for installed Medusa.
- `apps/store/src/payload.config.ts` enables scheduled content features but the repository does not demonstrate an external job runner.
- `README.md` deployment section explains admin routing but not durable processing, rollback, or restore procedures.

**Implementation**

1. Choose a supported deployment reference for this starter and document alternative-host requirements. Verify whether hosting supplies any modules before adding redundant configuration.
2. Configure durable event bus, workflow storage, distributed locking, worker/server responsibilities, and cache behavior according to installed Medusa and target topology. Redis workflow configuration alone is not proof of all four.
3. Define Payload scheduled-job execution for persistent versus serverless runtimes, authenticated triggering, queue ownership, concurrency, and retry monitoring.
4. Document ordered build/migration/release steps, compatibility-safe schema changes, graceful shutdown/drain, secrets, health/readiness checks, and preview isolation for databases/indexes/storage/payment/email resources.
5. Back up Medusa and CMS databases plus referenced media; document encryption/access controls, restore order, and search rebuild. Search indexes are derived and should not be the only copy of product data.
6. Run an isolated restore drill and restart/failure tests. Do not delete failed jobs or run production migrations as part of verification without explicit authorization.

**Acceptance**

- `T17-A`: Restarting API/worker processes mid-sync or notification does not silently lose committed work; retries follow documented deduplication rules.
- `T17-B`: Two instances cannot bypass cart/invoice locks or diverge indefinitely on required invalidation.
- `T17-C`: Health checks distinguish unready dependencies from a live process without revealing secrets.
- `T17-D`: An isolated database/media restore produces valid order history/content and can rebuild discovery indexes; recovery objectives and evidence are recorded.

### T18 — Make analytics truthful and observability actionable

**Priority:** P1. **Classification:** SOURCE-CONFIRMED + VERIFY event contracts. **Owner:** analytics workflows and service instrumentation.

**Evidence / entry points**

- Order analytics input mismatch is described in T09.
- `apps/medusa/src/api/store/analytics/route.ts` calls cart tracking with `id`; `apps/medusa/src/workflows/track-cart-events.ts` expects `cart_id`.
- `apps/medusa/src/subscribers/analytics-cart-events.ts` assumes `cart.item_*` names/payloads; verify actual emitted events for installed Medusa.
- No frontend analytics call sites were found in the inspected storefront source; backend provider presence is not evidence of full-funnel coverage.

**Implementation**

1. Define typed event schemas and authoritative sources for view/search/cart/checkout/order/refund events. Fix input mismatches and verify real event payloads with integration tests.
2. Derive trusted monetary/order events on the server; avoid double-counting a client event plus a core event. Treat search queries as potentially sensitive and minimize retention.
3. Separate optional telemetry failure handling from checkout/email correctness. Use bounded async delivery with observable failures, not floating promises or silent catch blocks.
4. Carry safe correlation IDs across Next.js, Medusa, jobs, providers, and webhooks. Add metrics for checkout failures, search latency/no-results, sync lag, retry backlog, and notification failures.
5. Preserve Sentry redaction tests and sampling controls. Do not add session replay or marketing trackers implicitly.

**Acceptance**

- `T18-A`: A documented purchase produces the intended events once according to defined semantics, with correct currency/order/cart IDs.
- `T18-B`: Disabled/unavailable analytics leaves purchase/receipt functionality intact and does not create unbounded queues.
- `T18-C`: A failed sync/email/webhook can be diagnosed by correlation ID without recovering customer secrets from telemetry.

### T19 — Establish automated tests and release gates

**Priority:** P0. **Classification:** SOURCE-CONFIRMED test gaps + BASELINE. **Owner:** cross-cutting quality engineering.

**Evidence / entry points**

- `apps/store/tests/sentry.test.mjs` is the only test discovered in the inspected storefront test directory.
- No checked-in `.github` workflow directory was found; no backend test script is declared.
- `package.json`, both app manifests, and `turbo.json` do not demonstrate a complete commerce test pipeline.

**Implementation**

1. Add unit tests for pure money/URL/validation helpers, Medusa integration tests for authorization/workflows, and browser E2E tests for critical journeys. Reuse existing tools where suitable; choose and document additions.
2. Start with representative failing tests under T00 and expand alongside each task. Use isolated disposable databases/indexes and local mail capture; never run destructive fixtures against a developer's existing database by default.
3. Use stable user-facing semantics and test IDs already present. Exercise keyboard submission, form validation, pending/error transitions, refresh, two customers, multiple tabs, and locale/market context without redesigning UI.
4. Separate deterministic provider stubs from explicitly opted-in real sandbox smoke tests. Do not claim mocked payments validate webhook signatures or actual provider interoperability.
5. Add package-owned scripts and Turbo tasks for backend/store/shared-package checks. CI must run install, lint/format checks, type checks, builds, relevant integration tests, and purchase E2E; missing scripts must not silently skip a package.
6. Keep logs/artifacts sanitized, test failures actionable, and retries bounded. Do not use skipped tests, broad type suppressions, or ignored build errors to obtain a green release.

**Acceptance**

- `T19-A`: Every task's acceptance criteria map to tests or named manual/sandbox verification with evidence and explicit blockers.
- `T19-B`: Introducing wrong workflow input keys, cross-customer invoice access, a first-100 catalog cap, or duplicate confirmation behavior fails a gate.
- `T19-C`: CI can recreate a working environment without production credentials and distinguishes deterministic coverage from sandbox coverage.
- `T19-D`: The release checklist in section 8 passes without unexplained skipped tests or hidden package failures.

### T20 — Publish the starter's supported configuration and extension contract

**Priority:** P1. **Classification:** BASELINE + DECISION. **Owner:** template architecture and documentation.

**Evidence / entry points**

- `apps/store/src/globals/Header/config.ts` and `globals/Footer/config.ts` configure navigation, while merchant identity/policy settings remain scattered across metadata, checkout, invoice configuration, and email templates.
- `apps/store/src/lib/data/cart.ts` contains exported no-op gift-card/discount helpers; verify consumers before removal. Promotion removal also has a separate working-intent implementation that must be repaired, not indiscriminately deleted.
- `README.md` describes architecture/setup but not a full capability matrix or production-readiness contract.

**Implementation**

1. Publish a capability matrix: working by default, requires sandbox credentials, requires merchant configuration, optional/not implemented. Remove exposed dead ends or gate them explicitly.
2. Define server-owned starter configuration for origin/branding/contact, supported locale/markets, policy references, feature flags, and provider profiles. CMS may edit editorial settings; secrets stay server-side and financial rules remain in Medusa.
3. Document extension recipes for optional capabilities without preinstalling every possible integration. Define safe references from CMS content to Medusa entities and behavior when the target disappears.
4. State the default product/fulfillment scope, guest checkout support, provider/region availability, and limitations. Digital goods, subscriptions, B2B, and fiscal compliance are not implicitly supported because Medusa can be extended to implement them.
5. Include operator checklists for configuring taxes, shipping, payments, policy content, email identity/deliverability, search settings, and backup/restore. Do not embed fabricated business policies as universal defaults.

**Acceptance**

- `T20-A`: A new developer can identify every external requirement and unsupported capability without reading implementation internals.
- `T20-B`: Disabling an optional feature leaves no broken advertised flow or fake success; mandatory commerce still works.
- `T20-C`: Branding/contact/policy configuration stays consistent across storefront metadata, checkout, email, and invoices without duplicating commerce truth.

## 6. Required regression matrix

Run the smallest matrix that covers each rule, using pairwise combinations where a full Cartesian product would be excessive. Include at least one dedicated test for every security and financial invariant.

| Dimension      | Required cases                                                                                                                            | Main tasks         |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| Identity       | Anonymous guest, owner, second customer, CMS editor, admin, expired session                                                               | T01, T02, T11, T13 |
| Locale/market  | Existing English/French/Arabic routes; valid second country; unsupported country/locale; switch during checkout                           | T03, T06, T12, T14 |
| Money          | Positive, zero, absent price; discount to zero; EUR/USD/TND; supported zero-decimal currency; tax-inclusive/exclusive                     | T05, T06, T10      |
| Inventory      | Single/multi-variant; invalid combination; unmanaged stock; backorder; stock 1; stock over 10; two buyers racing                          | T04, T05           |
| Cart           | No cookie, valid cart, expired/completed cart, backend outage, concurrent initial add, multi-tab edit, login transfer                     | T02, T04, T11      |
| Shipping       | Flat, calculated, zero-cost, quote failure, no method, changed address, pickup if advertised, multiple shipping lines                     | T05, T06, T10      |
| Promotions     | Valid, invalid, expired, automatic, two codes, remove one, usage limit, free shipping, market change                                      | T06                |
| Payment        | Demo, sandbox success, decline, additional-auth cancel, provider timeout, completion failure, browser return, duplicate/reordered webhook | T05, T17           |
| Catalog/search | Over 250 products, multiple channels, last-page access, unpublish/delete, stale event, index outage, quick typing, SSR GET results        | T07, T08, T14      |
| Content        | Draft/published/renamed/deleted; preview enter/exit; localized content; scheduled publish after restart; populated/unpopulated reference  | T11, T12           |
| Orders         | Over 20 orders; guest revisit; transfer; partial fulfillment/refund; cancel/return request; expired guest capability                      | T01, T13           |
| Side effects   | Duplicate delivery, send accepted then worker crash, invalid template, oversized attachment/logo, invoice race, analytics failure         | T09, T10, T17, T18 |
| Operations     | Fresh bootstrap, repeated bootstrap, missing optional provider, invalid enabled-provider config, worker restart, isolated restore         | T00, T16, T17, T19 |
| Operability    | Keyboard submit, failure recovery, initial HTML product facts, native/progressively enhanced mutation forms, no false 404 on outage       | T04, T08, T14, T19 |
| Privacy        | No optional consent, withdrawal, verified export/delete request, financial retention, redacted logs/errors/artifacts                      | T15, T18           |

## 7. Decisions and verification gates

These are implementation inputs, not requests to block writing this plan. Resolve them when the affected task starts.

| Decision                        | Safe planning position                                                               | Do not assume                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Supported baseline product type | Conventional physical-goods purchase; preserve currently working pickup/manual paths | Every Medusa-supported model is implemented by this template                       |
| Deployment reference            | Document one verified topology and requirements for alternatives                     | Hosting silently supplies Redis workers, locking, CMS scheduling, or shared caches |
| Payments                        | One demo mode plus one credential-gated Stripe sandbox profile                       | Stripe works in every merchant country/currency; manual equals paid                |
| Guest access                    | Preserve guest checkout with secure subsequent order access                          | Order ID or email alone proves identity                                            |
| Cart association                | Use verified Medusa semantics and explicit merge/replace behavior                    | Transfer automatically merges two carts or historical guest orders                 |
| Fiscal invoices                 | Sample document until jurisdiction/versioning requirements are explicitly met        | A PDF with an invoice number is globally compliant                                 |
| Returns/cancellation            | Staff-managed request path is a valid baseline                                       | Customer request automatically approves a refund or reverses fulfillment           |
| Privacy/legal content           | Merchant-configured policies and regional processing rules                           | Universal retention periods, checkbox text, or lawful tracking basis               |
| Algolia catalog scope           | Public discovery projection with server-enforced eligibility                         | Public index can safely contain personalized price lists/private metadata          |
| Scheduled publishing            | Verify/configure an actual runner                                                    | Enabling `schedulePublish` is sufficient                                           |
| Framework versions              | Verify installed packages/source for beta and newer APIs                             | Older Payload/Next.js/Medusa examples apply unchanged                              |

## 8. Definition of done and execution evidence

### Starter release gate

- [ ] T00–T20 are completed, or a maintainer-approved scope decision explicitly gates/removes the advertised capability with no dead end. P0 safety cannot be waived merely by documentation.
- [ ] Fresh local setup and repeat setup both work without production credentials or destructive surprises.
- [ ] Guest and authenticated purchases work in demo and configured sandbox profiles.
- [ ] Financial totals, zero/missing-price behavior, inventory contention, and retry semantics are tested.
- [ ] Customer/guest/staff access boundaries are demonstrated for orders, invoices, transfers, and private content.
- [ ] Password recovery/change, paginated order history, and minimum post-purchase support are functional.
- [ ] Product discovery is correct beyond demo-size data; unpublish/delete removes search visibility; editorial search is intentionally distinct.
- [ ] Cache isolation/freshness and localized routing hold through market switches, preview, publishing, payment returns, and worker restarts.
- [ ] Notifications are typed, observable, retryable, and deduplicated according to documented delivery semantics.
- [ ] Root robots/sitemaps/canonicals/structured data and public server HTML are verified.
- [ ] Provider configuration, privacy/consent behavior, demo limitations, operational topology, and restore procedure are documented and tested.
- [ ] Automated gates pass for every relevant package; real-provider checks are clearly distinguished from mocks.
- [ ] No secret, real customer record, production index write, or unintended customer email was introduced during testing.

### Existing commands to inspect before execution

These are repository entry points, not a claim that they currently pass or cover every task:

```bash
pnpm install --frozen-lockfile
node --run check
node --run check-types
node --run build
pnpm --filter @paydusa/store run test:sentry
```

T00/T19 must add or repair missing package-level commands. Use the current repository's package manager and scripts. Do not run database setup/reset/migration commands against existing data without understanding and authorizing the target.

### Task completion report template

```markdown
## Task Txx — <title>

- Status: pending | in-progress | blocked | completed
- Source rechecked: <files and relevant installed versions>
- Confirmed behavior: <reproduction or investigation result>
- Changes: <files and contract/config/schema changes>
- Tests: <command, environment, exact outcome, acceptance IDs covered>
- Runtime/sandbox evidence: <sanitized observations or not performed>
- Migration/rollback: <required procedure or not applicable>
- Remaining decisions/risks: <explicit list>
```

## 9. Reference guidance for implementers

Use current official documentation or Context7/MCP retrieval for the installed version. Links are starting points, not frozen API specifications.

- Medusa deployment: <https://docs.medusajs.com/learn/deployment/general>
- Medusa cart completion and failure handling: <https://docs.medusajs.com/resources/storefront-development/checkout/complete-cart>
- Medusa core workflow/reference and custom-route authorization: <https://docs.medusajs.com/resources/references> and <https://docs.medusajs.com/learn/fundamentals/api-routes>
- Payload access control, jobs, and migration guidance: <https://payloadcms.com/docs/access-control/overview>, <https://payloadcms.com/docs/jobs-queue/overview>, and the installed v4 migration guide/source.
- Next.js version-aware documentation: <https://nextjs.org/docs>; inspect proxy exports, cache tags/invalidation, metadata routes, server actions, and request boundaries specifically.
- Algolia documentation: <https://www.algolia.com/doc/>; verify indexing task completion, secured search access, replicas/sorting, and environment isolation.
- Stripe/Resend: use the official provider/SDK docs matching the installed packages; do not guess webhook, attachment, or idempotency contracts.

Before implementing each affected task, reload applicable local skills and the relevant references: `building-with-medusa` (authentication, API routes, workflows, query, events), `building-storefronts` (frontend integration), `payload`, `storefront-best-practices` (checkout, cart, search, account, SEO, agent-friendly/progressive enhancement), `turborepo`, `ultracite`, and any current runtime/test/security skill matching the work. Load design guidance only when touching UI; keep those changes limited to functional behavior and existing primitives.

If skill guidance conflicts with verified installed-framework behavior, record the discrepancy and use version-correct APIs while preserving the project's architectural/security invariants. Do not blindly apply Payload v3 defaults to v4, assume a generic Medusa port instead of this repository's `9100`, or require an unnecessary state-management/UI dependency.
