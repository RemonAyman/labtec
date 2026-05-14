"use client"

import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  User, 
  Settings,
  LogOut
} from "lucide-react"
import { useTranslations } from "next-intl"

export function DashboardNav() {
  const pathname = usePathname()
  const t = useTranslations("Dashboard")

  const items = [
    {
      title: t("overview"),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t("orders"),
      href: "/dashboard/orders",
      icon: ShoppingBag,
    },
    {
      title: t("wishlist"),
      href: "/wishlist",
      icon: Heart,
    },
    {
      title: t("profile"),
      href: "/dashboard/profile",
      icon: User,
    },
    {
      title: t("settings"),
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <nav className="flex flex-col space-y-2 p-4">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-cyan-500/10 hover:text-cyan-500 rtl:space-x-reverse",
            pathname === item.href ? "bg-cyan-500/10 text-cyan-500" : "text-muted-foreground"
          )}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.title}</span>
        </Link>
      ))}
      <button className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-all hover:bg-destructive/10 rtl:space-x-reverse">
        <LogOut className="h-5 w-5" />
        <span>{t("logout")}</span>
      </button>
    </nav>
  )
}
