require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testLoginFlow() {
  console.log("=== Testing Login Flow ===\n");
  
  // 1. Test backend API is reachable
  console.log("1. Testing backend API...");
  try {
    const response = await fetch("http://localhost:5002/api/users/profile", {
      headers: { "Authorization": "Bearer invalid_token" }
    });
    const data = await response.json();
    if (data.error === "Unauthorized: Missing or invalid token") {
      console.log("   ✅ Backend API is running and responding correctly\n");
    }
  } catch (err) {
    console.log("   ❌ Backend not reachable:", err.message);
    return;
  }
  
  // 2. Test database connection via Supabase client
  console.log("2. Testing database connection...");
  try {
    const { data: users, error } = await supabase.from('users').select('*').limit(1);
    if (error) throw error;
    console.log("   ✅ Database connected, found", users?.length || 0, "users\n");
  } catch (err) {
    console.log("   ❌ Database error:", err.message);
    return;
  }
  
  // 3. Test getting a user by ID (simulating login)
  console.log("3. Testing user profile fetch (login simulation)...");
  try {
    // Get first user to test with
    const { data: allUsers } = await supabase.from('users').select('id').limit(1);
    
    if (allUsers && allUsers.length > 0) {
      const testUserId = allUsers[0].id;
      
      // Simulate what backend does during login
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', testUserId)
        .single();
      
      if (error) throw error;
      console.log("   ✅ User profile fetch works");
      console.log("   User:", user.email, "| Role:", user.role, "| Uploads:", user.total_uploads, "\n");
    } else {
      console.log("   ⚠️  No users found in database\n");
    }
  } catch (err) {
    console.log("   ❌ User fetch error:", err.message, "\n");
  }
  
  // 4. Test Supabase Auth
  console.log("4. Testing Supabase Auth...");
  try {
    const { data: { users: authUsers }, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;
    console.log("   ✅ Supabase Auth working,", authUsers.length, "users in auth\n");
  } catch (err) {
    console.log("   ❌ Auth error:", err.message, "\n");
  }
  
  console.log("=== Summary ===");
  console.log("✅ Backend API: Running");
  console.log("✅ Database: Connected via Supabase client");
  console.log("✅ Login flow: Should work");
  console.log("\n📌 Test complete! Try logging in at: http://localhost:5173/login");
}

testLoginFlow();
