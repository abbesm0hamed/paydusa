import { defineConfig } from 'drizzle-kit';
import { keys } from './keys';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  schema: './schema',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: isProd ? keys().DATABASE_URL : keys().LOCAL_DATABASE_URL,
  },
});
