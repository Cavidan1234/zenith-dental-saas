-- Enable btree_gist extension required for PostgreSQL Exclusion Constraints (overlapping time ranges per staff/tenant)
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
