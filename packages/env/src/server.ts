import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,
  runtimeEnv: process.env,
  server: {
    CORS_ORIGIN: z.url(),
    DATABASE_URL: z.string().min(1),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
});
