import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  ShoppingBag, 
  Heart, 
  Clock, 
  CreditCard 
} from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

interface DashboardPageProps {
  params: Promise<{ locale: string }>
}

export default async function DashboardPage(props: DashboardPageProps) {
  const { locale } = await props.params
  const session = await auth()

  if (!session?.user?.id) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/dashboard`)
  }

  const isAr = locale === "ar"
  const t = await getTranslations("Dashboard")
  const tCommon = await getTranslations("Common")

  // 1. Fetch dynamic counts from DB
  const totalOrders = await db.order.count({
    where: { userId: session.user.id }
  })

  const activeOrders = await db.order.count({
    where: {
      userId: session.user.id,
      status: {
        in: ["PENDING", "PROCESSING", "DELIVERING"]
      }
    }
  })

  const wishlistData = await db.wishlist.findUnique({
    where: { userId: session.user.id },
    select: {
      _count: {
        select: { products: true }
      }
    }
  })
  const wishlistCount = wishlistData?._count.products || 0

  const totalSpentAggr = await db.order.aggregate({
    where: {
      userId: session.user.id,
      paymentStatus: { in: ["PAID", "COD"] }
    },
    _sum: {
      total: true
    }
  })
  const totalSpent = totalSpentAggr._sum.total || 0

  // 2. Fetch recent orders
  const recentOrders = await db.order.findMany({
    where: { userId: session.user.id },
    take: 5,
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  // Format statistics grid
  const stats = [
    {
      title: t("totalOrders"),
      value: totalOrders.toString(),
      icon: ShoppingBag,
      description: isAr ? "إجمالي الطلبات المسجلة" : "Lifetime orders placed",
    },
    {
      title: t("wishlist"),
      value: wishlistCount.toString(),
      icon: Heart,
      description: isAr ? "الأجهزة المفضلة المحفوظة" : "Saved laptops list",
    },
    {
      title: t("activeOrders"),
      value: activeOrders.toString(),
      icon: Clock,
      description: isAr ? "طلبات قيد الشحن والتوصيل" : "Shipments in transit",
    },
    {
      title: t("totalSpent"),
      value: `${totalSpent} ${isAr ? 'ج.م' : 'EGP'}`,
      icon: CreditCard,
      description: isAr ? "إجمالي المدفوعات المعتمدة" : "Total spent value",
    },
  ]

  // Helper for order status translation
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "DELIVERED": return tCommon("delivered")
      case "PROCESSING": return tCommon("processing")
      case "PENDING": return tCommon("pending")
      case "DELIVERING": return tCommon("inTransit")
      default: return isAr ? "ملغي" : "Cancelled"
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-cyan-500">
          {t("welcome", { name: session.user.name || "User" })}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {isAr 
            ? "مرحباً بك في لوحة تحكم حسابك. تتبع مشترياتك، وأدر أجهزتك المفضلة." 
            : "Welcome to your customer portal. Monitor shipments, manage wishlist, and check payment history."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-cyan-500/10 bg-card/40 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/25">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="border-cyan-500/10 bg-card/40 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg">{t("orders")}</CardTitle>
          <CardDescription>
            {isAr ? "قائمة بآخر 5 طلبات قمت بها على متجرنا." : "List of your 5 most recent laptop purchases."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <h3 className="text-md font-bold text-foreground">{isAr ? "لا توجد طلبات بعد" : "No Orders Yet"}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {isAr ? "لم تقم بعمل أي طلب شراء حتى الآن." : "You haven't placed any purchases yet."}
              </p>
              <Link 
                href="/products" 
                className="mt-4 text-xs font-bold text-cyan-500 hover:text-cyan-400"
              >
                {isAr ? "تصفح كتالوج الأجهزة" : "Browse Laptops Catalog"}
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-cyan-500/10">
                  <TableHead className="text-cyan-500 font-bold">{t("orderId")}</TableHead>
                  <TableHead>{t("product")}</TableHead>
                  <TableHead>{t("date")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className={isAr ? "text-left" : "text-right"}>{t("amount")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => {
                  const mainProduct = order.items[0]?.product
                  const extraItemsCount = order.items.length - 1
                  const displayProduct = mainProduct 
                    ? (isAr && mainProduct.nameAr ? mainProduct.nameAr : mainProduct.name)
                    : (isAr ? "لابتوب مميز" : "Premium Laptop")

                  const displayProductName = extraItemsCount > 0 
                    ? `${displayProduct} + ${extraItemsCount} ${isAr ? 'أخرى' : 'more'}`
                    : displayProduct

                  const dateFormatted = new Date(order.createdAt).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })

                  return (
                    <TableRow key={order.id} className="border-cyan-500/10 hover:bg-cyan-500/5 transition-all">
                      <TableCell className="font-semibold">
                        <Link href={`/orders/${order.id}`} className="text-cyan-500 hover:text-cyan-400 hover:underline">
                          #{order.id.slice(-6).toUpperCase()}
                        </Link>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{displayProductName}</TableCell>
                      <TableCell>{dateFormatted}</TableCell>
                      <TableCell>
                        <Badge 
                          className={cn(
                            "border",
                            order.status === "DELIVERED" ? "bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20" :
                            order.status === "CANCELLED" ? "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20" :
                            "bg-cyan-500/10 border-cyan-500/20 text-cyan-500 hover:bg-cyan-500/20"
                          )}
                        >
                          {getStatusLabel(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className={cn("font-bold", isAr ? "text-left" : "text-right")}>
                        {order.total} {isAr ? "ج.م" : "EGP"}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
