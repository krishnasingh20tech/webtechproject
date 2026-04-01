const { Pool } = require("pg");
require("dotenv").config({ path: require('path').resolve(__dirname, '../.env') });

// Supabase PostgreSQL Connection Pool
// Ensure you use the "Transaction" connection pooler string from Supabase settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
