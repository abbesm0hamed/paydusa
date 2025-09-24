import { loadEnv, defineConfig } from '@medusajs/framework/utils';

// Load environment variables based on NODE_ENV
loadEnv(process.env.NODE_ENV || 'development', process.cwd());

// Choose the appropriate database URL based on NODE_ENV
const getDatabaseUrl = () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    return process.env.LOCAL_DATABASE_URL || process.env.DATABASE_URL;
  }
  return process.env.DATABASE_URL;
};

// Get Redis URL from environment variables with fallback
const getRedisUrl = () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    return (
      process.env.LOCAL_REDIS_URL ||
      process.env.REDIS_URL ||
      'redis://localhost:6379'
    );
  }
  return process.env.REDIS_URL || 'redis://redis:6379';
};

module.exports = defineConfig({
  modules: [
    {
      resolve: '@medusajs/medusa/workflow-engine-redis',
      options: {
        redis: {
          url: getRedisUrl(),
        },
      },
    },
    {
      resolve: "./src/modules/payload",
      options: {
        serverUrl: process.env.PAYLOAD_SERVER_URL,
        apiKey: process.env.PAYLOAD_API_KEY,
        userCollection: process.env.PAYLOAD_USER_COLLECTION || "users",
      },
    },
    {
      resolve: "./src/modules/algolia",
      options: {
        appId: process.env.ALGOLIA_APP_ID!,
        apiKey: process.env.ALGOLIA_API_KEY!,
        productIndexName: process.env.ALGOLIA_PRODUCT_INDEX_NAME!,
      },
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
              // other options...
            },
          },
        ],
      },
    },
  ],
  projectConfig: {
    databaseUrl: getDatabaseUrl(),
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
  },
});
