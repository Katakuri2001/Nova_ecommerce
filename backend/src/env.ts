import type { D1Database, R2Bucket } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
  R2: R2Bucket;
  JWT_SECRET: string;
  NODE_ENV: string;
  CLOUDFLARE_API_KEY: string;
}

export type Database = D1Database;
