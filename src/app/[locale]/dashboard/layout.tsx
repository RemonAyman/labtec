"use client"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { useTranslations } from "next-intl"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = useTranslations("Dashboard")

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r bg-card/50 backdrop-blur-xl lg:block">
        <div className="flex h-16 items-center border-b px-6">
          <span className="text-xl font-bold tracking-tighter text-cyan-500">
            LAP TEC
          </span>
        </div>
        <DashboardNav />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="flex h-16 items-center border-b bg-card/50 backdrop-blur-xl px-6">
          <h1 className="text-lg font-semibold">{t("title")}</h1>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
