"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/routing"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"

const orders = [
  { id: "ORD-1234", product: "ASUS ROG Zephyrus G14", date: "2024-05-10", status: "delivered",  amount: "$1,599" },
  { id: "ORD-1235", product: "MacBook Pro M3 Max",    date: "2024-05-12", status: "processing", amount: "$3,200" },
  { id: "ORD-1236", product: "Logitech MX Master 3S", date: "2024-05-14", status: "pending",    amount: "$99" },
]

export default function OrdersPage() {
  const t = useTranslations("Dashboard")
  const tCommon = useTranslations("Common")

  const statusMap: Record<string, { label: string; className: string }> = {
    delivered:  { label: tCommon("delivered"),  className: "bg-green-500/20 text-green-500" },
    processing: { label: tCommon("processing"), className: "bg-cyan-500/20 text-cyan-500" },
    pending:    { label: tCommon("pending"),     className: "bg-yellow-500/20 text-yellow-500" },
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">{t("orders")}</h2>
      <div className="grid gap-4">
        {orders.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-cyan-500/10 bg-card/50">
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-cyan-500">{order.id}</p>
                  <p className="font-medium">{order.product}</p>
                  <p className="text-sm text-muted-foreground">{order.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={cn("w-fit", statusMap[order.status]?.className)}>
                    {statusMap[order.status]?.label}
                  </Badge>
                  <span className="font-bold text-cyan-500">{order.amount}</span>
                  <Link
                    href={`/orders/${order.id}`}
                    className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
