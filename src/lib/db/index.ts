import fs from 'fs';
import fsp from 'fs/promises';
import { fileURLToPath } from 'url';

// Fix for Next.js Webpack sandboxed URL object with Node's native fs/promises
const origReadFile = fsp.readFile;
fsp.readFile = function (this: any, path: any, ...args: any[]) {
  if (path && typeof path === 'object' && path.href) {
    try {
      path = fileURLToPath(path.href);
    } catch {
      path = path.href;
    }
  }
  return origReadFile.call(this, path, ...args);
} as any;

const origReadFileSync = fs.readFileSync;
fs.readFileSync = function (this: any, path: any, ...args: any[]) {
  if (path && typeof path === 'object' && path.href) {
    try {
      path = fileURLToPath(path.href);
    } catch {
      path = path.href;
    }
  }
  return origReadFileSync.call(this, path, ...args);
} as any;

import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

declare global {
  // eslint-disable-next-line no-var
  var __db_pglite_instance: PGlite | undefined;
  // eslint-disable-next-line no-var
  var __db_instance: any | undefined;
  // eslint-disable-next-line no-var
  var __db_initialized: boolean | undefined;
  // eslint-disable-next-line no-var
  var __db_seeded: boolean | undefined;
  // eslint-disable-next-line no-var
  var __db_seeding_promise: Promise<any> | undefined;
  // eslint-disable-next-line no-var
  var __db_pg_pool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __db_sec07_warned: boolean | undefined;
}

const DDL_STATEMENTS = `
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text,
  brand_color text DEFAULT '#0f766e',
  timezone text NOT NULL DEFAULT 'Asia/Baku',
  currency text NOT NULL DEFAULT 'USD',
  deposit_amount_cents integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  email text NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'customer',
  name text NOT NULL,
  phone text,
  created_at timestamp with time zone NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  title text NOT NULL,
  bio text,
  avatar_url text,
  specializations jsonb DEFAULT '[]',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  break_start text,
  break_end text,
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  duration_minutes integer NOT NULL DEFAULT 45,
  buffer_minutes integer NOT NULL DEFAULT 15,
  price_cents integer NOT NULL DEFAULT 0,
  deposit_cents integer NOT NULL DEFAULT 0,
  category text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  booking_code text,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id text,
  payment_status text NOT NULL DEFAULT 'unpaid',
  payment_method text,
  payment_label text,
  deposit_amount_cents integer DEFAULT 0,
  notes text,
  internal_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT NOW()
);

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_code text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_method text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_label text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS deposit_amount_cents integer DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS internal_notes text;
CREATE UNIQUE INDEX IF NOT EXISTS bookings_code_idx ON bookings (booking_code);

CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL UNIQUE,
  event_type text NOT NULL,
  processed_at timestamp with time zone NOT NULL DEFAULT NOW(),
  payload jsonb
);

CREATE TABLE IF NOT EXISTS recall_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text,
  last_visit_date timestamp with time zone NOT NULL,
  recall_due_date timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamp with time zone NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS tenants_slug_idx ON tenants(slug);
CREATE INDEX IF NOT EXISTS bookings_tenant_staff_time_idx ON bookings(tenant_id, staff_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings(status);
CREATE INDEX IF NOT EXISTS staff_schedules_staff_day_idx ON staff_schedules(staff_id, day_of_week);
CREATE INDEX IF NOT EXISTS services_tenant_idx ON services(tenant_id);
`;

/**
 * Initializes database client. Supports real PostgreSQL (via pg.Pool) if DATABASE_URL
 * is configured and reachable, otherwise falls back seamlessly to in-memory PGlite
 * which executes genuine PostgreSQL dialect.
 */
function createDatabaseClient() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  const isProduction = process.env.NODE_ENV === 'production';
  const requireDatabaseUrl = process.env.REQUIRE_DATABASE_URL === 'true';
  const forcePglite = process.env.USE_PGLITE === 'true';

  if (databaseUrl) {
    const isInvalidUrl =
      databaseUrl.includes('sqlite') || databaseUrl.includes('memory');

    if (isProduction) {
      if (isInvalidUrl) {
        throw new Error(
          '[SEC-07] Invalid DATABASE_URL in production: a persistent PostgreSQL connection string is required.'
        );
      }
      if (!globalThis.__db_pg_pool) {
        globalThis.__db_pg_pool = new Pool({
          connectionString: databaseUrl,
          connectionTimeoutMillis: 2000,
          max: 20,
        });
      }
      return drizzlePg(globalThis.__db_pg_pool, { schema });
    }

    if (!forcePglite && !isInvalidUrl) {
      try {
        if (!globalThis.__db_pg_pool) {
          globalThis.__db_pg_pool = new Pool({
            connectionString: databaseUrl,
            connectionTimeoutMillis: 2000,
            max: 20,
          });
        }
        return drizzlePg(globalThis.__db_pg_pool, { schema });
      } catch (err) {
        if (requireDatabaseUrl) {
          throw err;
        }
        console.warn('[DB] Could not connect to PostgreSQL via DATABASE_URL, falling back to PGlite:', err);
      }
    }
  }

  if (requireDatabaseUrl) {
    throw new Error(
      '[SEC-07] REQUIRE_DATABASE_URL=true but DATABASE_URL is not configured. Refusing ephemeral PGlite fallback.'
    );
  }

  if (!globalThis.__db_sec07_warned) {
    globalThis.__db_sec07_warned = true;
    console.warn(
      '[SEC-07 SECURITY WARNING] DATABASE_URL is not set; running in demo mode with ephemeral in-memory PGlite. State will not persist across serverless instances or container restarts.'
    );
  }

  // Demo/development fallback to PGlite (genuine in-memory PostgreSQL engine)
  if (!globalThis.__db_pglite_instance) {
    globalThis.__db_pglite_instance = new PGlite();
  }
  return drizzlePglite(globalThis.__db_pglite_instance, { schema });
}

export function getRawPglite(): PGlite | undefined {
  return globalThis.__db_pglite_instance;
}

export async function ensureInitialized(customDb?: any) {
  if (globalThis.__db_initialized && !customDb) {
    return;
  }

  const pglite = globalThis.__db_pglite_instance;
  if (pglite) {
    await pglite.exec(DDL_STATEMENTS);
  } else if (globalThis.__db_pg_pool) {
    await globalThis.__db_pg_pool.query(DDL_STATEMENTS);
  }
  globalThis.__db_initialized = true;
}

export async function ensureSeeded(customDb?: any) {
  await ensureInitialized(customDb);
  if (globalThis.__db_seeded) {
    return;
  }
  if (globalThis.__db_seeding_promise) {
    return await globalThis.__db_seeding_promise;
  }

  globalThis.__db_seeding_promise = (async () => {
    try {
      const activeDb = customDb || db;
      const existingTenant = await activeDb.query.tenants.findFirst({
        where: (t: any, { eq }: any) => eq(t.slug, 'zenith-dental'),
      });
      if (!existingTenant) {
        const { seed } = await import('./seed');
        await seed();
      }
      globalThis.__db_seeded = true;
    } catch (err) {
      console.error('[DB] ensureSeeded failed:', err);
      if (
        (process.env.NODE_ENV === 'production' && Boolean(process.env.DATABASE_URL?.trim())) ||
        process.env.REQUIRE_DATABASE_URL === 'true'
      ) {
        throw err;
      }
    } finally {
      globalThis.__db_seeding_promise = undefined;
    }
  })();

  return await globalThis.__db_seeding_promise;
}

// Singleton database instance
export const db = globalThis.__db_instance || (globalThis.__db_instance = createDatabaseClient());

// Auto-run schema initialization and seeding if using PGlite
if (globalThis.__db_pglite_instance && !globalThis.__db_initialized) {
  ensureSeeded().catch((err) => {
    console.error('[DB] Auto-seed failed:', err);
  });
}

export * from './schema';
