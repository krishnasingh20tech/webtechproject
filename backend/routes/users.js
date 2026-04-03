const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/auth");

// Get User Profile & Quota Info
// Requires JWT Authorization Header
router.get("/profile", verifyToken, async (req, res) => {
  try {
    // req.user is extracted from the JWT in auth middleware
    const userId = req.user.id;
    console.log("Fetching profile for userId:", userId);
    
    let result = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
    console.log("Database query result:", result.rows.length, "rows found");

    const user = result.rows[0];
    
    if (!user) {
      // In a strict environment, if user doesn't exist in our public table
      // (perhaps because the trigger failed or hadn't run), we'd return a 404.
      // Or we can manually insert them here if they just signed up:
      console.log("User not found in database for id:", userId);
      return res.status(404).json({ error: "User not found in public.users table" });
    }

    const freeUploadsRemaining = Math.max(0, 5 - user.total_uploads);

    res.json({
      user,
      freeUploadsRemaining,
      totalUploads: user.total_uploads,
    });
  } catch (error) {
    console.error("Error in /profile route:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ error: "Server error fetching user profile", details: error.message });
  }
});

// Get User's Upload History
router.get("/my-uploads", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const query = `
      SELECT id, file_path, status, tier, instructions, created_at, edited_file_path
      FROM uploads
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await db.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error fetching uploads" });
  }
});

module.exports = router;
