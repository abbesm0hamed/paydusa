declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MEDUSA_BACKEND_URL: string;
      MEDUSA_PUBLISHABLE_KEY: string;
      MEDUSA_ADMIN_EMAIL: string;
      MEDUSA_ADMIN_PASSWORD: string;
      NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: string;
      NEXT_PUBLIC_SERVER_URL: string;
      NEXT_PUBLIC_BASE_URL: string;
      NEXT_PUBLIC_DEFAULT_REGION: string;
      NEXT_PUBLIC_STRIPE_KEY: string;
      NEXT_PUBLIC_WWW_URL: string;
      NEXT_PUBLIC_ALGOLIA_APP_ID: string;
      NEXT_PUBLIC_ALGOLIA_PRODUCT_INDEX_NAME: string;
      NEXT_PUBLIC_SENTRY_DSN?: string;
      NEXT_PUBLIC_SENTRY_ENVIRONMENT?: string;
      NEXT_PUBLIC_VERCEL_URL: string;
      PREVIEW_SECRET: string;
      PAYLOAD_SERVER_URL: string;
      REVALIDATE_SECRET: string;
      SENTRY_ORG?: string;
      SENTRY_PROJECT?: string;
      SENTRY_AUTH_TOKEN?: string;
      FACEBOOK_DOMAIN_VERIFICATION: string;
      R2_PUBLIC_URL: string;
      R2_ACCESS_KEY_ID: string;
      R2_SECRET_ACCESS_KEY: string;
      R2_BUCKET: string;
      R2_ENDPOINT: string;
      VERCEL_PROJECT_PRODUCTION_URL: string;
    }
  }
}

export {};
