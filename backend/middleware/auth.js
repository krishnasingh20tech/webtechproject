const supabase = require("../config/supabase");

// Middleware to verify Supabase JWT
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  console.log("Auth middleware - Authorization header present:", !!authHeader);
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Auth middleware - Missing or invalid Authorization header");
    return res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Auth middleware - Token extracted, length:", token?.length);

  try {
    // We use Supabase native JWT verification which handles both old HS256 and new ECC (P-256) asymmetric keys out-of-the-box
    console.log("Auth middleware - Calling supabase.auth.getUser...");
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.log("Auth middleware - getUser error:", error?.message || "User not found");
      throw error || new Error("User not found in token");
    }
    
    console.log("Auth middleware - User verified:", user.id, user.email);
    
    // Pass user payload to next route
    req.user = {
      id: user.id,
      email: user.email,
    };
    
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = verifyToken;
