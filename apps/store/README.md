# Storefront and Payload CMS

This Next.js app serves the storefront at `http://localhost:3000` and the embedded
Payload admin at `http://localhost:3000/admin`.

Copy `.env.template` to `.env` and configure your secrets. Local URL settings are:

```dotenv
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
PAYLOAD_SERVER_URL=http://localhost:3000
```

`NEXT_PUBLIC_SERVER_URL` also determines the origin of Payload password-reset
emails. Restart the development server after changing environment variables and
request a new reset email; existing emails keep their old links.

The Medusa backend runs on `http://localhost:9100`. Its environment should use
`PAYLOAD_SERVER_URL=http://localhost:3000` and allow `http://localhost:3000` in
`STORE_CORS` and `AUTH_CORS`.

## Sentry

In the same Sentry account/organization used by Medusa, create a **Next.js**
project for the storefront. Copy its DSN from **Settings → Projects → your
storefront project → Client Keys (DSN)** into `apps/store/.env`:

```dotenv
NEXT_PUBLIC_SENTRY_DSN=your-storefront-project-dsn
# Optional: defaults to NODE_ENV (development/production).
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development
```

Restart `pnpm --filter store dev` after changing these values. Production builds
must receive the DSN and environment at **build time**, since Next.js embeds
`NEXT_PUBLIC_*` values in the browser bundle. Leave the DSN empty to disable
reporting. Medusa keeps its existing project and `SENTRY_DSN` unchanged.

Browser errors, unhandled server request errors (including Server Components,
route handlers, and Server Actions), and root-layout render errors are captured
for both the storefront and embedded Payload app. Events have the
`service:storefront` tag. Traces are sampled at 10% in production and 100% in
development. Sentry v11 data-collection controls disable automatic user data,
cookies, HTTP headers/bodies/query parameters, database query data, and stack
variables. Console breadcrumbs are dropped to avoid forwarding application debug
logs; session replay is not enabled. These controls do not scrub arbitrary error
messages or explicitly attached custom context: never include credentials or
customer/payment details in either, and keep Sentry's server-side scrubbing on.

For readable production stack traces, set these **build/CI-only** variables:

```dotenv
SENTRY_ORG=your-existing-organization-slug
SENTRY_PROJECT=your-storefront-project-slug
SENTRY_AUTH_TOKEN=your-sentry-source-map-upload-token
```

The token must be authorized to upload source maps to this project. Never prefix
it with `NEXT_PUBLIC_` or commit it. Uploads are skipped without all three values;
error reporting still works with just the DSN. Uploaded source maps are deleted
from the build output. When enabling uploads on a previously cached CI build,
force a rebuild (`pnpm exec turbo run build --filter=store --force`).

To verify delivery after adding the DSN, trigger a temporary, controlled error in
development and confirm it appears in the **storefront** project with the
`service:storefront` tag. Remove the temporary error afterward; development
render errors may also appear in the Next.js error overlay.

Run `pnpm --filter store test:sentry` to check configuration defaults without
sending events to Sentry.

See the [root README](../../README.md) for setup instructions and
[Payload v4 migration notes](./PAYLOAD_V4_MIGRATION.md) before upgrading an existing
database.
