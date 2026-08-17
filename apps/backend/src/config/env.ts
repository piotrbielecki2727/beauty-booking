import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  AUTH_EMAIL_VERIFICATION_CODE: z
    .string()
    .regex(/^\d{6}$/)
    .default("111111"),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(24),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
});

const env = envSchema.parse(process.env);

export { env };
