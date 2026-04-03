require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Testing Supabase connection...");
console.log("URL:", supabaseUrl);
console.log("Key starts with:", supabaseKey?.substring(0, 10) + "...");

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  try {
    // Test auth
    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) throw authError;
    console.log("✅ Auth connection successful! Users found:", authUsers?.length || 0);

    // Test database via Supabase client
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("count")
      .limit(0);
    
    if (usersError && usersError.code === "42P01") {
      console.log("❌ 'users' table does NOT exist - need to run create-tables.sql");
    } else if (usersError) {
      console.log("⚠️ Database users query error:", usersError.code, usersError.message);
    } else {
      console.log("✅ 'users' table exists");
    }
    
    const { data: uploads, error: uploadsError } = await supabase
      .from("uploads")
      .select("count")
      .limit(0);
    
    if (uploadsError && uploadsError.code === "42P01") {
      console.log("❌ 'uploads' table does NOT exist - need to run create-tables.sql");
    } else if (uploadsError) {
      console.log("⚠️ Database uploads query error:", uploadsError.code, uploadsError.message);
    } else {
      console.log("✅ 'uploads' table exists");
    }
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Supabase connection failed:", err.message);
    process.exit(1);
  }
}

testSupabase();
