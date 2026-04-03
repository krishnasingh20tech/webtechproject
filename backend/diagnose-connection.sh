#!/bin/bash

echo "🔍 Supabase Connection Diagnostic"
echo "=================================="
echo ""
echo "Project Reference: yqnrkiiodxurmvoiovml"
echo ""

# Test DNS resolution for different Supabase hostnames
echo "Testing DNS resolution..."

echo ""
echo "1. Testing direct connection (db.PROJECT_REF.supabase.co):"
host db.yqnrkiiodxurmvoiovml.supabase.co 2>&1 || echo "   ❌ Not found"

echo ""
echo "2. Testing Supavisor pooler (aws-0-ap-south-1.pooler.supabase.com):"
host aws-0-ap-south-1.pooler.supabase.com 2>&1 || echo "   ❌ Not found"

echo ""
echo "3. Testing Supavisor pooler (aws-0-us-east-1.pooler.supabase.com):"
host aws-0-us-east-1.pooler.supabase.com 2>&1 || echo "   ❌ Not found"

echo ""
echo "=================================="
echo "📋 To fix this issue:"
echo ""
echo "1. Go to https://app.supabase.com"
echo "2. Open your project"
echo "3. Click 'Project Settings' → 'Database'"
echo "4. Copy the correct connection string:"
echo "   - URI (Session mode): for long connections"
echo "   - URI (Transaction mode): for most queries"
echo ""
echo "Or get it from 'Project Settings' → 'API':"
echo "   - Project URL"
echo "   - Project Reference (should match: yqnrkiiodxurmvoiovml)"
echo ""
echo "5. Update backend/.env with the correct DATABASE_URL"
echo ""
