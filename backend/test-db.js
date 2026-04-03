const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function testConnection() {
  try {
    console.log("Testing database connection...");
    const result = await pool.query("SELECT NOW() as current_time, current_database() as database");
    console.log("✅ Database connection successful!");
    console.log("   Server time:", result.rows[0].current_time);
    console.log("   Database:", result.rows[0].database);
    
    // Check if users table exists
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'uploads')
    `);
    
    console.log("\n📋 Tables found:", tables.rows.map(r => r.table_name).join(", ") || "None");
    
    if (tables.rows.length === 0) {
      console.log("\n⚠️  WARNING: 'users' and 'uploads' tables don't exist!");
      console.log("   Run the SQL in backend/create-tables.sql in your Supabase SQL Editor");
    }
    
    // Check for existing users
    if (tables.rows.some(r => r.table_name === 'users')) {
      const users = await pool.query("SELECT COUNT(*) as count FROM users");
      console.log("   Users in database:", users.rows[0].count);
    }
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Database connection failed:");
    console.error("   Error:", err.message);
    console.error("\n🔧 Troubleshooting:");
    console.error("   1. Check if DATABASE_URL is correct in backend/.env");
    console.error("   2. Verify your Supabase project is active");
    console.error("   3. Check if your IP is allowed in Supabase Database Settings");
    process.exit(1);
  }
}

testConnection();
