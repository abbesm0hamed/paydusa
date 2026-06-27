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
      NEXT_PUBLIC_R2_HOSTNAME: string;
      NEXT_PUBLIC_ALGOLIA_APP_ID: string;
      NEXT_PUBLIC_ALGOLIA_API_KEY: string;
      NEXT_PUBLIC_ALGOLIA_PRODUCT_INDEX_NAME: string;
      NEXT_PUBLIC_VERCEL_URL: string;
      PREVIEW_SECRET: string;
      PAYLOAD_SERVER_URL: string;
      REVALIDATE_SECRET: string;
      FACEBOOK_DOMAIN_VERIFICATION: string;
      S3_FILE_URL: string;
      S3_ACCESS_KEY_ID: string;
      S3_SECRET_ACCESS_KEY: string;
      S3_REGION: string;
      S3_BUCKET: string;
      S3_ENDPOINT: string;
      VERCEL_PROJECT_PRODUCTION_URL: string;
    }
  }
}

export {};
