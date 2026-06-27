# Ecommerce Monorepo

A modern ecommerce stack built with Next.js (storefront + embedded Payload CMS) and Medusa.

## Architecture

- **`apps/store`**: Next.js storefront with embedded Payload CMS admin, consuming Medusa APIs.
- **`apps/medusa`**: Medusa backend for commerce logic (Products, Cart, Orders).
- **`packages/ui`**: Shared shadcn/ui components and design system.
- **`packages/medusa`**: Shared Medusa client, types, and utilities.
- **`packages/db`**: Shared database infrastructure (Docker, migrations).
- **`packages/config`**: Shared linting and TypeScript configuration.
- **`packages/env`**: Shared environment variable validation (Zod).

## Getting Started

### Prerequisites

- **Node.js** >= 22
- **pnpm** >= 9 (`corepack enable && corepack install`)
- **Docker** (for PostgreSQL + Redis)

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp apps/medusa/.env.template apps/medusa/.env
cp apps/store/.env.template apps/store/.env
# Edit both .env files with your own secrets (keys, passwords, etc.)

# 3. Start databases (PostgreSQL on :5555, Redis on :6379)
node --run db:start

# 4. Run migrations and seed data
node --run db:setup

# 5. Start development servers
node --run dev
```

That's it. The apps are available at:

| App               | URL                                                                     |
| ----------------- | ----------------------------------------------------------------------- |
| Storefront        | http://localhost:8000                                                   |
| Medusa admin      | http://localhost:9100/app                                               |
| Payload CMS admin | http://localhost:8000/admin                                             |
| pgAdmin           | http://localhost:5050 (email: `admin@ecommerce.com`, password: `admin`) |

> **First Medusa login**: email `admin@medusajs.com`, password set via `MEDUSA_ADMIN_PASSWORD` in `apps/medusa/.env`.

## Deployment

The project has two admin interfaces that are best kept separate:

| Admin                        | Hosting                          | Path                                                                             |
| ---------------------------- | -------------------------------- | -------------------------------------------------------------------------------- |
| **Medusa** (commerce engine) | Subdomain like `api.example.com` | `/app` — the admin at `/app` avoids conflicts with store API routes (`/store/*`) |
| **Payload CMS** (content)    | Same domain as the storefront    | `/admin` — embedded in the Next.js app                                           |

Medusa on a subdomain isolates the commerce backend from the customer-facing site, avoids route conflicts with Payload's `/admin`, and has no SEO impact (admin interfaces aren't indexed).

## Key Scripts

- `node --run dev`: Start all apps in parallel.
- `node --run dev:store`: Start only the storefront.
- `node --run dev:medusa`: Start only the Medusa backend.
- `node --run check`: Run linting and formatting (Ultracite).
- `node --run db:start` / `node --run db:stop` / `node --run db:down`: Manage Docker services.
- `node --run db:setup`: Reset and scaffold all databases.

---

_Built by merging [nextjs-starter-medusa](https://github.com/medusajs/nextjs-starter-medusa) with Payload's [website template](https://github.com/payloadcms/payload/tree/main/templates/website), scaffolded via [create-better-t-stack](https://github.com/AmanVarshney01/create-better-t-stack)._
