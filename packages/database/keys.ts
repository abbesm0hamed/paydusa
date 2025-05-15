import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      DATABASE_URL: z.string().min(1).url(),
      LOCAL_DATABASE_URL: z.string().min(1).url(),
    },
    runtimeEnv: {
      DATABASE_URL: process.env.DATABASE_URL,
      LOCAL_DATABASE_URL: process.env.LOCAL_DATABASE_URL,
    },
  });
