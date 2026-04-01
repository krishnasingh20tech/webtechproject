const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/auth");

// Process an Upload
// Expects: { filePaths: ["path/to/file1.jpg", "path/to/file2.jpg"], tier: "Premium" }
// Requires JWT Authorization Header
router.post("/", verifyToken, async (req, res) => {
  try {
    const { filePaths, tier, instructions } = req.body;
    const userId = req.user.id;

    if (!filePaths || !Array.isArray(filePaths) || filePaths.length === 0) {
      return res
        .status(400)
        .json({ error: "Missing or invalid filePaths array" });
    }
    const fileCount = filePaths.length;

    // Get user
    const result = await db.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "User not found in public.users table" });
    }
    const user = result.rows[0];

    // Check quota logic
    const freeUploadsRemaining = Math.max(0, 5 - user.total_uploads);
    let chargeAmount = 0;

    if (freeUploadsRemaining >= fileCount) {
      // It's completely free
      chargeAmount = 0;
    } else {
      const paidPhotos = fileCount - freeUploadsRemaining;
      // Calculate charge based on custom pricing logic
      if (paidPhotos === 1) chargeAmount = 5;
      else if (paidPhotos === 2) chargeAmount = 9;
      else if (paidPhotos === 5) chargeAmount = 20;
      else {
        // Fallback standard rate per photo if not exactly 1, 2, or 5
        chargeAmount = paidPhotos * 5;
      }
    }

    // 1. Record uploads in DB
    for (let i = 0; i < filePaths.length; i++) {
      await db.query(
        "INSERT INTO uploads (user_id, file_path, tier, instructions) VALUES ($1, $2, $3, $4)",
        [user.id, filePaths[i], tier || "Basic", instructions || ""],
      );
    }

    // 2. Increment total_uploads for user
    const updatedUserRes = await db.query(
      "UPDATE users SET total_uploads = total_uploads + $1 WHERE id = $2 RETURNING *",
      [fileCount, user.id],
    );

    res.json({
      success: true,
      message: "Uploads recorded successfully",
      chargeAmount,
      totalUploads: updatedUserRes.rows[0].total_uploads,
    });
  } catch (error) {
    console.error("Upload Route Error:", error);
    res.status(500).json({ error: "Server error processing upload metadata" });
  }
});

module.exports = router;
