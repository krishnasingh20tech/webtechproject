const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/auth");

// Middleware to check role
// This should be applied AFTER verifyToken
const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      const result = await db.query("SELECT role FROM users WHERE id = $1", [req.user.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
      
      const userRole = result.rows[0].role;
      if (!roles.includes(userRole)) {
        return res.status(403).json({ error: "Forbidden: Insufficient permissions for role " + userRole });
      }
      
      // Save role for later use if needed
      req.user.role = userRole;
      next();
    } catch (err) {
      console.error("Role Check Error", err);
      res.status(500).json({ error: "Server error checking role" });
    }
  };
};

// ==========================================
// SUPERADMIN ROUTES
// ==========================================

// Get all uploaded files across all users
router.get("/all-uploads", verifyToken, requireRole(["superadmin"]), async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.file_path, u.instructions, u.status, u.tier, u.created_at, u.assigned_admin, u.edited_file_path,
             us.email as user_email, us.name as user_name
      FROM uploads u
      JOIN users us ON u.user_id = us.id
      ORDER BY u.created_at DESC
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
});

// Get all admins (to populate the assignment dropdown)
router.get("/admins", verifyToken, requireRole(["superadmin"]), async (req, res) => {
  try {
    const result = await db.query("SELECT id, email, name FROM users WHERE role = 'admin'");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch admins" });
  }
});

// Assign an admin to an upload
router.put("/assign-upload/:uploadId", verifyToken, requireRole(["superadmin"]), async (req, res) => {
  try {
    const { uploadId } = req.params;
    const { adminId } = req.body;
    
    // Check if admin exists
    if (adminId) {
      const adminCheck = await db.query("SELECT id FROM users WHERE id = $1 AND role = 'admin'", [adminId]);
      if (adminCheck.rows.length === 0) return res.status(400).json({ error: "Invalid admin ID" });
    }

    const updateQuery = `
      UPDATE uploads 
      SET assigned_admin = $1, status = 'assigned'
      WHERE id = $2 
      RETURNING *
    `;
    const result = await db.query(updateQuery, [adminId, uploadId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to assign upload" });
  }
});

// Approve an edited upload and send to user
router.put("/approve-upload/:uploadId", verifyToken, requireRole(["superadmin"]), async (req, res) => {
  try {
    const { uploadId } = req.params;
    const result = await db.query(
      "UPDATE uploads SET status = 'complete' WHERE id = $1 RETURNING *",
      [uploadId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to approve upload" });
  }
});

// Change user role (Superadmin creates an admin by upgrading a standard user account)
router.put("/change-role", verifyToken, requireRole(["superadmin"]), async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!["user", "admin", "superadmin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    const result = await db.query(
      "UPDATE users SET role = $1 WHERE email = $2 RETURNING id, email, role",
      [role, email]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found with that email" });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to change role" });
  }
});


// ==========================================
// ADMIN ROUTES
// ==========================================

// Get uploads assigned specifically to this admin
router.get("/my-tasks", verifyToken, requireRole(["admin", "superadmin"]), async (req, res) => {
  try {
    const adminId = req.user.id;
    // NOTE: We do not join with users table to keep the original user anonymous!
    const query = `
      SELECT id, file_path, instructions, status, tier, created_at, edited_file_path
      FROM uploads
      WHERE assigned_admin = $1
      ORDER BY created_at ASC
    `;
    const result = await db.query(query, [adminId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch assigned tasks" });
  }
});

// Submit an edited photo
router.put("/submit-edit/:uploadId", verifyToken, requireRole(["admin", "superadmin"]), async (req, res) => {
  try {
    const { uploadId } = req.params;
    const { editedFilePath } = req.body;
    const adminId = req.user.id;
    
    // Ensure this admin actually owns this upload task
    const checkQuery = "SELECT id FROM uploads WHERE id = $1 AND assigned_admin = $2";
    const checkRes = await db.query(checkQuery, [uploadId, adminId]);
    if (checkRes.rows.length === 0) return res.status(403).json({ error: "Task not assigned to you" });

    const updateQuery = `
      UPDATE uploads 
      SET edited_file_path = $1, status = 'reviewing'
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(updateQuery, [editedFilePath, uploadId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit edit" });
  }
});

module.exports = router;
