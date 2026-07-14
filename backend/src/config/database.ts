// src/config/database.ts
import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

// Local Postgres (localhost / 127.0.0.1) typically has no TLS available, so we
// don't force SSL there — that would break local development. Every other host
// (e.g. Neon and other managed Postgres) is reached over TLS with FULL
// certificate verification (rejectUnauthorized: true), which prevents MITM
// impersonation of the DB server. Neon's certificates are signed by a
// publicly-trusted CA, so Node's default trust store validates them and no
// custom CA bundle is required.
const isLocalDb = /@(localhost|127\.0\.0\.1)(:|\/)/.test(connectionString || '');

const poolConfig: PoolConfig = {
  connectionString,
  ssl: isLocalDb ? false : { rejectUnauthorized: true },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err: Error) => {
  console.error('Unexpected database error:', err);
});

export default pool;
