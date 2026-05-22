"use server"

import { db } from "@/lib/db"
import { registerSchema } from "@/lib/validations/auth"
import bcrypt from "bcryptjs"
import { z } from "zod"

type RegisterInput = z.infer<typeof registerSchema>

export async function registerUser(data: RegisterInput) {
  try {
    const validated = registerSchema.safeParse(data)
    if (!validated.success) {
      return { error: validated.error.issues[0]?.message || "Invalid input data" }
    }

    const { name, email, password } = validated.data

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "Email already registered" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user in database
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER", // Default role
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "An unexpected error occurred during registration" }
  }
}
