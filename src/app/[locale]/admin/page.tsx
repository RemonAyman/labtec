import { db } from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function AdminPage({ params }: PageProps) {
  const { locale } = await params
  
  // Protect route by checking session role
  const session = await auth()
  if (!session || session.user?.role !== "ADMIN") {
    redirect(`/${locale}/login`)
  }

  // Fetch all initial dashboard data in parallel
  const [products, orders, requests, users, categories, brands] = await Promise.all([
    db.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        brand: true,
        images: true
      }
    }),
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } }
      }
    }),
    db.usedLaptopRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } }
      }
    }),
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.brand.findMany({ orderBy: { name: "asc" } })
  ])

  return (
    <AdminDashboard
      products={products}
      orders={orders}
      requests={requests}
      users={users}
      categories={categories}
      brands={brands}
      locale={locale}
    />
  )
}
