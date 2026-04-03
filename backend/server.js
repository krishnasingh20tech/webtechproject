const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_mock_123");
const db = require("./config/db");

// Route files
const usersRoute = require("./routes/users");
const uploadsRoute = require("./routes/uploads");
const adminRoute = require("./routes/admin");
const stripeRoute = require("./routes/stripe");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Stripe Webhook Endpoint MUST be before express.json()
app.post("/api/payment/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Check if metadata exists
    if (!session.metadata) {
      console.error("Metadata is missing from session.");
      return res.status(200).send("No metadata, skipped.");
    }

    const { userId, tier } = session.metadata;

    // Reconstruct instructions
    let instructions = "";
    for (let i = 0; i < 50; i++) {
      if (session.metadata[`inst_${i}`]) {
        instructions += session.metadata[`inst_${i}`];
      } else {
        break;
      }
    }

    // Reconstruct filePaths
    let filePathsJSON = "";
    for (let i = 0; i < 50; i++) {
      if (session.metadata[`paths_${i}`]) {
        filePathsJSON += session.metadata[`paths_${i}`];
      } else {
        break;
      }
    }

    try {
      let parsedPaths = [];
      try {
        parsedPaths = JSON.parse(filePathsJSON || '[]');
      } catch (e) {
        console.error("Failed to parse filePathsJSON:", filePathsJSON);
      }

      if (parsedPaths.length > 0) {
        // Insert uploads into our database
        for (let i = 0; i < parsedPaths.length; i++) {
          await db.query(
            "INSERT INTO uploads (user_id, file_path, tier, instructions) VALUES ($1, $2, $3, $4)",
            [userId, parsedPaths[i], tier || "Basic", instructions || ""],
          );
        }

        // Update total_uploads
        await db.query(
          "UPDATE users SET total_uploads = total_uploads + $1 WHERE id = $2",
          [parsedPaths.length, userId],
        );

        console.log(`Successfully processed order for user ${userId} with payment ${session.amount_total / 100}`);
      }
    } catch (err) {
      console.error("Error processing successful payment data:", err);
    }
  }

  res.status(200).send("Received");
});

app.use(express.json());

// Main logical routes for interacting with Database
// Main logical routes for interacting with Database
app.use("/api/users", usersRoute);
app.use("/api/uploads", uploadsRoute);
app.use("/api/admin", adminRoute);
app.use("/api/payment", stripeRoute);

// Vercel's experimental multi-service router strips the /api prefix. 
// We add these fallback routes so the backend still catches the requests!
app.use("/users", usersRoute);
app.use("/uploads", uploadsRoute);
app.use("/admin", adminRoute);
app.use("/payment", stripeRoute);

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
  });

  server.on('error', (e) => {
    console.error("Server error:", e);
    if (e.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use!`);
      process.exit(1);
    }
  });
}

module.exports = app;
