const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_mock_123");
const verifyToken = require("../middleware/auth");
const db = require("../config/db");

// Define FRONTEND_URL from environment or fallback
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

// Create a checkout session
router.post("/create-checkout-session", verifyToken, async (req, res) => {
  try {
    const { amount, filePaths, tier, instructions } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Prepare metadata to store in the Stripe session so we can process it in the webhook
    const metadata = {
      userId: userId.toString(),
      tier: tier || "Basic",
    };

    // Chunk instructions (max 500 chars per key in Stripe)
    const instStr = instructions || "";
    for (let i = 0; i < Math.ceil(instStr.length / 500); i++) {
      metadata[`inst_${i}`] = instStr.substring(i * 500, (i + 1) * 500);
    }

    // Chunk filePaths
    const pathsStr = JSON.stringify(filePaths);
    for (let i = 0; i < Math.ceil(pathsStr.length / 500); i++) {
      metadata[`paths_${i}`] = pathsStr.substring(i * 500, (i + 1) * 500);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "ImageRevive Pro Photo Enhancement",
              description: `${filePaths.length} photo(s) - ${tier || "Basic"} tier`,
            },
            unit_amount: amount * 100, // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      metadata: metadata,
      success_url: `${FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&payment=success`,
      cancel_url: `${FRONTEND_URL}/dashboard?payment=cancelled`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

module.exports = router;
