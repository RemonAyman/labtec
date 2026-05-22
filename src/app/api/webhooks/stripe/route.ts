import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") || ""

  let event

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error("Missing STRIPE_WEBHOOK_SECRET.")
      return new NextResponse("Webhook secret not configured", { status: 500 })
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  // Handle successful payments
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any
    const orderId = session.metadata?.orderId

    if (orderId) {
      try {
        await db.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "PAID",
            status: "PROCESSING", // advance order status
          },
        })
        console.log(`Order ${orderId} successfully marked as PAID via Stripe webhook.`)
      } catch (dbError) {
        console.error(`Database error updating order ${orderId}:`, dbError)
        return new NextResponse("Database update failed", { status: 500 })
      }
    }
  }

  return new NextResponse("Success", { status: 200 })
}
