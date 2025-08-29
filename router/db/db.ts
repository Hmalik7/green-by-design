const { Pool } = require('pg');
const { DB } = require('../config');

const pool = new Pool({
  user: DB.PGUSER,
  host: DB.PGHOST,
  database: DB.PGDATABASE,
  password: DB.PGPASSWORD,
  port: DB.PGPORT
});

export const db = {
  query: (text: string, params: any[]) => pool.query(text, params)
}