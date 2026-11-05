import {
  loadEnv,
  defineConfig,
  Modules,
  ContainerRegistrationKeys,
} from "@medusajs/framework/utils";

// Load environment variables based on NODE_ENV
loadEnv(process.env.NODE_ENV || "development", process.cwd());

// Choose the appropriate database URL based on NODE_ENV
const getDatabaseUrl = () => {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    return process.env.LOCAL_DATABASE_URL || process.env.DATABASE_URL;
  }
  return process.env.DATABASE_URL;
};

// Get Redis URL from environment variables with fallback
const getRedisUrl = () => {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    return (
      process.env.LOCAL_REDIS_URL ||
      process.env.REDIS_URL ||
      "redis://localhost:6379"
    );
  }
  return process.env.REDIS_URL || "redis://redis:6379";
};

module.exports = defineConfig({
  admin: {
    path: process.env.MEDUSA_ADMIN_PATH || "/app",
  },
  modules: [
    {
      resolve: "@medusajs/medusa/product",
    },
    {
      dependencies: [Modules.CACHE, ContainerRegistrationKeys.LOGGER],
      options: {
        providers: [
          {
            id: "emailpass",
            resolve: "@medusajs/medusa/auth-emailpass",
          },
        ],
      },
      resolve: "@medusajs/medusa/auth",
    },
    {
      options: {
        redis: {
          url: getRedisUrl(),
        },
      },
      resolve: "@medusajs/medusa/workflow-engine-redis",
    },
    {
      options: {
        apiKey: process.env.ALGOLIA_ADMIN_API_KEY!,
        appId: process.env.ALGOLIA_APP_ID!,
        productIndexName: process.env.ALGOLIA_PRODUCT_INDEX_NAME!,
      },
      resolve: "./src/modules/algolia",
    },
    {
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            // Keep the provider ID stable for existing file records.
            id: "s3",
            options: {
              access_key_id: process.env.R2_ACCESS_KEY_ID,
              bucket: process.env.R2_BUCKET,
              endpoint: process.env.R2_ENDPOINT,
              file_url: process.env.R2_PUBLIC_URL,
              prefix: "medusa/",
              region: process.env.R2_REGION,
              secret_access_key: process.env.R2_SECRET_ACCESS_KEY,
            },
          },
        ],
      },
      resolve: "@medusajs/medusa/file",
    },
    {
      options: {
        providers: [
          {
            id: "posthog",
            options: {
              posthogEventsKey: process.env.POSTHOG_EVENTS_API_KEY,
              posthogHost:
                process.env.POSTHOG_HOST || "https://eu.i.posthog.com",
            },
            resolve: "@medusajs/analytics-posthog",
          },
        ],
      },
      resolve: "@medusajs/medusa/analytics",
    },
    {
      options: {
        providers: [
          {
            id: "resend",
            options: {
              api_key: process.env.RESEND_API_KEY,
              channels: ["email"],
              from: process.env.RESEND_FROM_EMAIL,
            },
            resolve: "./src/modules/resend",
          },
        ],
      },
      resolve: "@medusajs/medusa/notification",
    },
    {
      resolve: "./src/modules/invoice-generator",
    },
  ],
  plugins: [
    {
      options: {},
      resolve: "@medusajs/draft-order",
    },
  ],
  projectConfig: {
    databaseUrl: getDatabaseUrl(),
    http: {
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      cookieSecret: process.env.COOKIE_SECRET,
      jwtSecret: process.env.JWT_SECRET,
      storeCors: process.env.STORE_CORS!,
    },
  },
});
