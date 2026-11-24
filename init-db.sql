-- Enable uuid-ossp extension for PostgreSQL UUID helpers (slot concurrency is enforced via SELECT ... FROM staff FOR UPDATE)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
