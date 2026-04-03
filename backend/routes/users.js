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

    let user = result.rows[0];

    if (!user) {
      console.log("User not found in database, creating implicitly for id:", userId);
      try {
        const { data: newUser, error } = await db.supabase.from('users').insert({
          id: userId,
          email: req.user.email,
          role: 'user',
          total_uploads: 0
        }).select().single();

        if (error) throw error;
        user = newUser;
      } catch (err) {
        console.error("Auto-insert failed:", err);
        return res.status(500).json({ error: "Failed to initialize new user profile" });
      }
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
