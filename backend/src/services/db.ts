import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
export const pool = connectionString ? new Pool({ connectionString }) : null;
export async function ensureSchema() {
  if (!pool) return;
  await pool.query(`
    create table if not exists units(
      id serial primary key,
      code text not null unique,
      owner_name text
    );
    create table if not exists payments(
      id serial primary key,
      date date,
      detail text,
      amount numeric,
      unit_code text references units(code) on delete set null
    );
  `);
}
