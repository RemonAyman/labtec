import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient

const connectionString = `${process.env.DATABASE_URL}`

if (process.env.NODE_ENV === "production") {
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  prisma = new PrismaClient({ adapter })
} else {
  if (!global.prisma) {
    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    global.prisma = new PrismaClient({ adapter })
  }
  prisma = global.prisma
}

export const db = prisma
