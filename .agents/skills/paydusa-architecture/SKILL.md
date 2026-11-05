---
name: paydusa-architecture
description: Paydusa monorepo conventions, commands, and "where code goes" map — apps/store (Next.js 16 + embedded PayloadCMS), apps/medusa (Medusa 2 backend, sole product source), packages (design-system, email, env, config), pnpm catalog rules, turbo tasks, ultracite/knip/lefthook gates, docker services. Use for ANY change in this repo before writing code, when adding a dependency, or when unsure where a file belongs.
---

# Paydusa Monorepo Conventions

Two apps, four packages. Product data lives **only** in Medusa; Payload manages editorial content.

## Layout

| Path                     | Name                     | Role                                                                                                                                      |
| ------------------------ | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/medusa`            | `@paydusa/medusa`        | Medusa v2 (2.22.1) backend. `src/{admin,api,jobs,links,modules,scripts,subscribers,workflows}`                                            |
| `apps/store`             | `@paydusa/store`         | Next.js 16.4.3 storefront with **embedded PayloadCMS** 4.0.0-beta.4 admin + Postgres, S3 storage, Resend email                            |
| `packages/design-system` | `@paydusa/design-system` | UI primitives (shadcn CLI, base-lyra style, CVA + `cn`). Subpath exports `./components/*`, `./lib/*`, `./globals.css`, `./postcss.config` |
| `packages/email`         | `@paydusa/email`         | React Email templates + Resend plumbing (CommonJS). Consumed **only** by Medusa's notification provider                                   |
| `packages/env`           | `@paydusa/env`           | t3-oss `createEnv` wrappers (`./server`, `./web`). Mostly scaffolding today                                                               |
| `packages/config`        | `@paydusa/config`        | Shared `tsconfig.base.json` only                                                                                                          |

## Where new code goes

- **Commerce logic (products, carts, orders, payments, search, fulfillment) → `apps/medusa/src/…`** — never Payload, never the storefront data layer.
  - module service: `src/modules/<name>/{index.ts,service.ts}` + register in `medusa-config.ts`
  - multi-step mutations: `src/workflows/` (+ `steps/`), idempotent, with compensating steps
  - event reactions: `src/subscribers/<event>.ts`; scheduled: `src/jobs/`
  - REST endpoints: `src/api/admin/*` and `src/api/store/*` with middlewares in `src/api/middlewares.ts`
- **Editorial content (pages, posts, globals, media, categories) → `apps/store/src/payload/…` collections/blocks.** After touching config run `payload generate:types` + `generate:importmap` (store scripts).
- **UI primitives → `packages/design-system/src/components/*`** via shadcn CLI against that package's `components.json` (aliases `@paydusa/design-system/*`). Never copy a primitive into the store locally. Components use CVA `variants` + `cn`; plain function components, no `forwardRef`.
- **Email templates → `packages/email/src/templates/*.tsx`**, exported through `src/index.tsx` (`EmailTemplate` union + `emailSubjects`). Any new notification needs both.
- **Store pages/routes → `apps/store/src/app/[locale]/[countryCode]/…`** (see `paydusa-i18n` skill). Data fetching via server actions in `src/lib/data/*.ts` using `sdk.client.fetch` + `authHeaders`/`cacheOptions` from `src/lib/cookies.ts`.

## Version discipline (pnpm catalogs — STRICT)

`pnpm-workspace.yaml` has `catalogMode: strict`. Rules:

- Every dependency version must come from a catalog: `catalog:`, or `catalog:medusa` / `catalog:mikro-orm` / `catalog:payload` / `catalog:storefront`. Never bump a catalog entry by hand for one package.
- Upgrade framework families **together**: all `@medusajs/*` move in one edit; all `@payloadcms/*` + `payload` in one edit.
- `minimumReleaseAge: 60` — packages newer than 60 days are rejected; don't fight this, choose the latest allowed.
- Adding a dep: `pnpm add <pkg>` resolves from the default catalog automatically; only use direct carets for single-app, non-shared deps (like `next-intl` today).

## Commands

```bash
node --run dev:store        # storefront dev (turbo -F @paydusa/store)
node --run dev:medusa       # Medusa dev on port 9100
node --run db:start         # docker compose: postgres(5555) + redis(6379) + pgadmin(5050)
node --run db:setup         # migrate + seed medusa (admin@medusajs.com), payload migrate
node --run check            # ultracite check (oxlint + oxfmt)
node --run fix              # ultracite fix — run on touched files before committing
node --run knip             # unused exports/files wrapper (sets PAYLOAD_SECRET for analysis)
node --run check-types      # turbo tsc --noEmit
```

Store builds with `payload build`, not plain `next build`. Payload types: `src/payload-types.ts` (generated — never hand-edit). Import map: `src/app/(payload)/admin/importMap.js` (generated).

Docker: 2 databases (`ecommerce_medusa`, `ecommerce_cms`) created by `docker/initdb/01-create-dbs.sh`; postgres user `ecommerce_admin`, host port 5555. Medusa dev uses `LOCAL_DATABASE_URL` / `LOCAL_REDIS_URL`; production reads `DATABASE_URL` / `REDIS_URL`.

## Gates before commit

1. `node --run fix` (lefthook pre-commit runs oxlint/oxfmt on staged files anyway — but run it first to avoid surprises).
2. `node --run knip` when adding/removing exports or packages.
3. `node --run check-types` for type-level changes.
4. `packages/env`: if you introduce a new env var, add it to the relevant `.env.template` and (if validated) `packages/env/src/{server,web}.ts` following the zod v4 pattern; read it in `medusa-config.ts` or the app that needs it — variables are NOT shared via `@paydusa/env` yet.

## Env var naming convention

- Medusa server-side secrets: bare names in `apps/medusa/.env.template` (e.g. `ALGOLIA_ADMIN_API_KEY`, `RESEND_API_KEY`).
- Store public values: `NEXT_PUBLIC_*` (e.g. `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, `MEDUSA_BACKEND_URL`).
- File storage: S3/R2 vars with `prefix: "medusa/"`.
