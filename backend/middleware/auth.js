const supabase = require("../config/supabase");

// Middleware to verify Supabase JWT
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // We use Supabase native JWT verification which handles both old HS256 and new ECC (P-256) asymmetric keys out-of-the-box
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      throw error || new Error("User not found in token");
    }
    
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
