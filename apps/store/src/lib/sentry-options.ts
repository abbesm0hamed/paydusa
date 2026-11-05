import type { Breadcrumb, init } from "@sentry/nextjs";

// NEXT_PUBLIC values are inlined into the browser bundle at build time.
export const sentryOptions = {
  // Application and SDK debug logs may contain credentials or customer data.
  beforeBreadcrumb: (breadcrumb: Breadcrumb): Breadcrumb | null =>
    breadcrumb.category === "console" ? null : breadcrumb,
  // Sentry v11 uses dataCollection instead of the removed sendDefaultPii option.
  dataCollection: {
    cookies: false,
    databaseQueryData: false,
    genAI: { inputs: false, outputs: false },
    graphQL: { document: false, variables: false },
    httpBodies: [],
    httpHeaders: false,
    mcp: { inputs: false, outputs: false },
    queues: false,
    stackFrameVariables: false,
    urlQueryParams: false,
    userInfo: false,
  },
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment:
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  initialScope: {
    tags: {
      service: "storefront",
    },
  },
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
} satisfies Parameters<typeof init>[0];
