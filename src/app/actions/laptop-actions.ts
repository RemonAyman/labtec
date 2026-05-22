"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { OrderStatus } from "@prisma/client"

// Interface for Used Laptop request
export interface UsedLaptopInput {
  brand: string
  model: string
  specs: string
  condition: string
  images: string[]
}

// Action to submit a used laptop request
export async function submitUsedLaptopRequest(data: UsedLaptopInput) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "You must be logged in to submit a request." }
  }

  if (!data.brand || !data.model || !data.specs || !data.condition) {
    return { error: "Please fill out all required fields." }
  }

  try {
    const request = await db.usedLaptopRequest.create({
      data: {
        userId: session.user.id,
        brand: data.brand,
        model: data.model,
        specs: data.specs,
        condition: data.condition,
        images: data.images.length > 0 ? data.images : ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"],
        status: "PENDING"
      }
    })

    return { success: true, requestId: request.id }
  } catch (error) {
    console.error("Error submitting used laptop request:", error)
    return { error: "Failed to submit request. Please try again." }
  }
}

// Action to update order status
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized access." }
  }

  try {
    await db.order.update({
      where: { id: orderId },
      data: { status }
    })

    revalidatePath("/admin")
    revalidatePath("/dashboard/orders")
    return { success: true }
  } catch (error) {
    console.error("Error updating order status:", error)
    return { error: "Failed to update order status." }
  }
}

// Action to review used laptop request (Approve/Reject)
export async function reviewUsedLaptopRequest(requestId: string, status: "APPROVED" | "REJECTED") {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized access." }
  }

  try {
    const request = await db.usedLaptopRequest.update({
      where: { id: requestId },
      data: { status }
    })

    // If approved, we can also list it under the USED products
    if (status === "APPROVED") {
      // Find or create 'Used Laptops' category and brand or assign a default
      let category = await db.category.findFirst({
        where: { name: { contains: "Student Laptops", mode: "insensitive" } }
      })
      if (!category) {
        category = await db.category.findFirst()
      }

      let brand = await db.brand.findFirst({
        where: { name: { contains: request.brand, mode: "insensitive" } }
      })
      if (!brand) {
        brand = await db.brand.create({
          data: { name: request.brand }
        })
      }

      // Create product automatically
      const product = await db.product.create({
        data: {
          name: `${request.brand} ${request.model} (Used)`,
          nameAr: `${request.brand} ${request.model} (مستعمل)`,
          description: request.specs,
          descAr: request.specs,
          price: 299.99, // default placeholder price, admin can edit later
          condition: "USED",
          stock: 1,
          categoryId: category?.id || "",
          brandId: brand.id,
          rating: 4.0
        }
      })

      // Add request images to the product
      for (const imgUrl of request.images) {
        await db.productImage.create({
          data: {
            url: imgUrl,
            productId: product.id
          }
        })
      }
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error reviewing used laptop request:", error)
    return { error: "Failed to update request status." }
  }
}

// Admin Action to create a new product
export async function createProduct(data: {
  name: string
  nameAr: string
  description: string
  descAr: string
  price: number
  condition: string
  stock: number
  categoryId: string
  brandId: string
  images: string[]
}) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized access." }
  }

  try {
    const product = await db.product.create({
      data: {
        name: data.name,
        nameAr: data.nameAr,
        description: data.description,
        descAr: data.descAr,
        price: data.price,
        condition: data.condition,
        stock: data.stock,
        categoryId: data.categoryId,
        brandId: data.brandId,
        rating: 5.0
      }
    })

    // Create images
    for (const url of data.images) {
      if (url.trim()) {
        await db.productImage.create({
          data: {
            url: url.trim(),
            productId: product.id
          }
        })
      }
    }

    revalidatePath("/products")
    revalidatePath("/admin")
    return { success: true, productId: product.id }
  } catch (error) {
    console.error("Error creating product:", error)
    return { error: "Failed to create product." }
  }
}

// Admin Action to edit a product
export async function updateProduct(
  productId: string,
  data: {
    name: string
    nameAr: string
    description: string
    descAr: string
    price: number
    condition: string
    stock: number
    categoryId: string
    brandId: string
    images: string[]
  }
) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized access." }
  }

  try {
    await db.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        nameAr: data.nameAr,
        description: data.description,
        descAr: data.descAr,
        price: data.price,
        condition: data.condition,
        stock: data.stock,
        categoryId: data.categoryId,
        brandId: data.brandId
      }
    })

    // Delete existing images first and recreate them
    await db.productImage.deleteMany({
      where: { productId }
    })

    for (const url of data.images) {
      if (url.trim()) {
        await db.productImage.create({
          data: {
            url: url.trim(),
            productId
          }
        })
      }
    }

    revalidatePath(`/products/${productId}`)
    revalidatePath("/products")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error updating product:", error)
    return { error: "Failed to update product." }
  }
}

// Admin Action to delete a product
export async function deleteProduct(productId: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized access." }
  }

  try {
    await db.product.delete({
      where: { id: productId }
    })

    revalidatePath("/products")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    return { error: "Failed to delete product." }
  }
}
