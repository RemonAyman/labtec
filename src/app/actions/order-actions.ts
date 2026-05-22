"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { OrderStatus } from "@prisma/client"
import { stripe } from "@/lib/stripe"

interface OrderItemInput {
  productId: string
  quantity: number
}

interface PlaceOrderInput {
  name: string
  phone: string
  city: string
  address: string
  fulfillment: "DELIVERY" | "PICKUP"
  paymentMethod: "STRIPE" | "COD"
  items: OrderItemInput[]
}

interface CheckedItem {
  productId: string
  name: string
  nameAr: string
  price: number
  quantity: number
}

// Action to place a new order (supports Stripe session generation or cash on delivery)
export async function placeOrder(data: PlaceOrderInput) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "You must be logged in to place an order." }
  }

  if (!data.name || !data.phone || !data.city || !data.address || !data.items || data.items.length === 0) {
    return { error: "Missing required order information or items are empty." }
  }

  try {
    // 1. Verify products and check inventory stock
    const checkedItems: CheckedItem[] = []
    let computedTotal = 0

    for (const item of data.items) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        return { error: `Laptop not found in catalog.` }
      }

      if (product.stock < item.quantity) {
        return { error: `Insufficient stock for ${product.name}. Only ${product.stock} available.` }
      }

      checkedItems.push({
        productId: product.id,
        name: product.name,
        nameAr: product.nameAr || product.name,
        price: product.price,
        quantity: item.quantity,
      })

      computedTotal += product.price * item.quantity
    }

    // Add optional flat shipping rate if fulfilment is DELIVERY
    const shippingFee = data.fulfillment === "DELIVERY" ? 150 : 0 // 150 EGP or USD standard
    computedTotal += shippingFee

    // 2. Perform DB operations inside transaction
    const result = await db.$transaction(async (tx) => {
      // Find or create address for user
      let addressRecord = await tx.address.findFirst({
        where: {
          userId: session.user.id,
          phone: data.phone,
          city: data.city,
          address: data.address,
        },
      })

      if (!addressRecord) {
        addressRecord = await tx.address.create({
          data: {
            userId: session.user.id,
            name: data.name,
            phone: data.phone,
            city: data.city,
            address: data.address,
            isDefault: true,
          },
        })
      }

      // Create Order in database
      const order = await tx.order.create({
        data: {
          userId: session.user.id!,
          total: computedTotal,
          status: "PENDING",
          paymentStatus: data.paymentMethod === "COD" ? "COD" : "UNPAID",
          addressId: addressRecord.id,
        },
      })

      // Create Order Items and decrease stock
      for (const checkedItem of checkedItems) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: checkedItem.productId,
            quantity: checkedItem.quantity,
            price: checkedItem.price,
          },
        })

        // Decrease stock
        await tx.product.update({
          where: { id: checkedItem.productId },
          data: {
            stock: {
              decrement: checkedItem.quantity,
            },
          },
        })
      }

      return order
    })

    // 3. Handle payments routing
    if (data.paymentMethod === "STRIPE") {
      // Create Stripe session
      const locale = "en" // default checkout lang
      
      const lineItems = checkedItems.map((item) => ({
        price_data: {
          currency: "egp", // Egyptians or standard USD
          product_data: {
            name: item.name,
            description: `Lap Tec premium laptop checkout`,
          },
          unit_amount: Math.round(item.price * 100), // convert to cents
        },
        quantity: item.quantity,
      }))

      if (shippingFee > 0) {
        lineItems.push({
          price_data: {
            currency: "egp",
            product_data: {
              name: "Shipping Fee",
              description: "Home delivery handling",
            },
            unit_amount: Math.round(shippingFee * 100),
          },
          quantity: 1,
        })
      }

      // Origin URL for redirects
      const origin = process.env.NEXTAUTH_URL || "http://localhost:3000"

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${origin}/${locale}/orders/${result.id}?status=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/${locale}/checkout?status=cancelled`,
        metadata: {
          orderId: result.id,
          userId: session.user.id!,
        },
      })

      return { success: true, stripeUrl: stripeSession.url, orderId: result.id }
    }

    // Cash on delivery directly returns orderId for navigation
    revalidatePath("/dashboard/orders")
    return { success: true, orderId: result.id }
  } catch (error) {
    console.error("Error creating order:", error)
    return { error: "Failed to place your order. Please try again." }
  }
}

// Fetch all orders of active user
export async function getUserOrders() {
  const session = await auth()
  if (!session?.user?.id) {
    return []
  }

  try {
    const orders = await db.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            }
          }
        },
        address: true
      },
      orderBy: { createdAt: "desc" }
    })
    return orders
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return []
  }
}

export async function getOrderDetails(orderId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }

  if (orderId === "TRACK-123") {
    return {
      id: "TRACK-123",
      userId: session.user.id,
      total: 15150,
      status: "PROCESSING" as const,
      paymentStatus: "PAID",
      createdAt: new Date(),
      address: {
        id: "mock-addr-id",
        userId: session.user.id,
        name: session.user.name || "Customer",
        phone: "01555664146",
        city: "Cairo",
        address: "123 Tahreer Square",
        isDefault: true,
      },
      items: [
        {
          id: "mock-item-id",
          orderId: "TRACK-123",
          productId: "mock-prod-id",
          quantity: 1,
          price: 15000,
          product: {
            id: "mock-prod-id",
            name: "Premium Pro Laptop",
            nameAr: "لابتوب برو المميز",
            price: 15000,
            description: "High performance demo laptop",
            descriptionAr: "لابتوب عالي الأداء للعرض",
            images: [{ id: "mock-img-id", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8", productId: "mock-prod-id" }],
            stock: 10,
            brandId: "mock-brand-id",
            categoryId: "mock-cat-id",
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      ]
    }
  }

  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
                brand: true
              }
            }
          }
        },
        address: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Security check: restrict user to only viewing their own orders, unless admin
    if (order && order.userId !== session.user.id && session.user.role !== "ADMIN") {
      return null
    }

    return order
  } catch (error) {
    console.error("Error retrieving order details:", error)
    return null
  }
}
