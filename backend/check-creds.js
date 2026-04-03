// Quick credential checker
console.log("=== Supabase Credential Checker ===\n");

const projectRef = "yqnrkiiodxurmvoiovml";
const password = "AnshikaVaish";

console.log("Project Reference:", projectRef);
console.log("Password length:", password.length);
console.log("\n⚠️  If password is less than 20 characters, it's likely wrong!");
console.log("   Real Supabase passwords are auto-generated and look like:");
console.log("   'eE9kLm5PQRs4TuVwXyZ1aBcDe2FgHiJk'\n");

console.log("=== How to get the correct password ===");
console.log("1. Go to: https://app.supabase.com/project/yqnrkiiodxurmvoiovml/settings/database");
console.log("2. Under 'Connection info' → click 'Reveal' next to Password");
console.log("3. Copy the long password shown");
console.log("4. Update backend/.env DATABASE_URL with the real password\n");

console.log("Current connection string format:");
console.log(`postgresql://postgres.${projectRef}:${password}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres\n`);
