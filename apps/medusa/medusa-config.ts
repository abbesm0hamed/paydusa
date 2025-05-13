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

module.exports = defineConfig({
  modules: [
    {
      resolve: '@medusajs/medusa/workflow-engine-redis',

      options: {
        redis: {
          url: process.env.REDIS_URL,
        },
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
