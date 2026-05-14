"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { motion } from "framer-motion"

import { useTranslations } from "next-intl"

export default function DashboardPage() {
  const t = useTranslations("Dashboard")
  const tCommon = useTranslations("Common")

  const stats = [
    {
      title: t("totalOrders"),
      value: "12",
      icon: ShoppingBag,
      description: "+2 from last month",
    },
    {
      title: t("wishlist"),
      value: "8",
      icon: Heart,
      description: "Saved items",
    },
    {
      title: t("activeOrders"),
      value: "1",
      icon: Clock,
      description: "In transit",
    },
    {
      title: t("totalSpent"),
      value: "$4,299",
      icon: CreditCard,
      description: "Lifetime value",
    },
  ]

  const recentOrders = [
    {
      id: "ORD-1234",
      product: "ASUS ROG Zephyrus G14",
      date: "2024-05-10",
      status: tCommon("delivered"),
      amount: "$1,599",
    },
    {
      id: "ORD-1235",
      product: "MacBook Pro M3 Max",
      date: "2024-05-12",
      status: tCommon("processing"),
      amount: "$3,200",
    },
    {
      id: "ORD-1236",
      product: "Logitech MX Master 3S",
      date: "2024-05-14",
      status: tCommon("pending"),
      amount: "$99",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-cyan-500/10 bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-cyan-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="border-cyan-500/10 bg-card/50">
        <CardHeader>
          <CardTitle>{t("orders")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("orderId")}</TableHead>
                <TableHead>{t("product")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="text-right">{t("amount")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-cyan-500">
                    {order.id}
                  </TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={order.status === tCommon("delivered") ? "default" : "secondary"}
                      className={order.status === tCommon("delivered") ? "bg-green-500/20 text-green-500" : ""}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{order.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
