import { drizzle } from 'drizzle-orm';
import { keys } from './keys';
import * as schema from './schema';

let database;

if (process.env.NODE_ENV === 'production') {
  // Neon in production
  const { neon } = await import('@neondatabase/serverless');
  const client = neon(keys().DATABASE_URL);
  database = drizzle(client, { schema });
} else {
  // Local dev with `pg`
  const { Client } = await import('pg');
  const client = new Client({ connectionString: keys().LOCAL_DATABASE_URL });
  await client.connect();
  database = drizzle(client, { schema });
}

export { database };
