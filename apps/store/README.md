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

See the [root README](../../README.md) for setup instructions and
[Payload v4 migration notes](./PAYLOAD_V4_MIGRATION.md) before upgrading an existing
database.
