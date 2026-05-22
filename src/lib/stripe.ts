import Stripe from "stripe"

const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_for_build"

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Warning: STRIPE_SECRET_KEY is missing from environment variables.")
}

export const stripe = new Stripe(stripeKey, {
  apiVersion: "2025-01-27" as any, // Matches the newest Stripe API specs
  typescript: true,
})
