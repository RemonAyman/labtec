"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Moon, Sun, Globe, Bell, Shield } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Link } from "@/i18n/routing"

export default function SettingsPage() {
  const t = useTranslations("Dashboard")
  const tCommon = useTranslations("Common")
  const { resolvedTheme } = useTheme()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">{t("settings")}</h2>

      <div className="grid gap-4">
        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="border-cyan-500/10 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {resolvedTheme === "dark" ? <Moon className="h-4 w-4 text-cyan-500" /> : <Sun className="h-4 w-4 text-cyan-500" />}
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Currently: {resolvedTheme === "dark" ? "Dark" : "Light"}
                </p>
              </div>
              <ThemeToggle />
            </CardContent>
          </Card>
        </motion.div>

        {/* Language */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-cyan-500/10 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-4 w-4 text-cyan-500" />
                Language
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="font-medium">Site Language</p>
                <p className="text-sm text-muted-foreground">Switch between Arabic and English</p>
              </div>
              <div className="flex gap-2">
                <Link href="/" locale="ar" className="rounded-lg border border-cyan-500/20 px-3 py-1.5 text-sm font-medium transition-all hover:border-cyan-500 hover:text-cyan-500">
                  العربية
                </Link>
                <Link href="/" locale="en" className="rounded-lg border border-cyan-500/20 px-3 py-1.5 text-sm font-medium transition-all hover:border-cyan-500 hover:text-cyan-500">
                  English
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-cyan-500/10 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4 text-cyan-500" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="font-medium">Order Updates</p>
                <p className="text-sm text-muted-foreground">Get notified about order status changes</p>
              </div>
              <Button variant="outline" size="sm" className="border-cyan-500/20">
                Enabled
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-cyan-500/10 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4 text-cyan-500" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </div>
              <Link href="/forgot-password" className="rounded-lg border border-cyan-500/20 px-3 py-1.5 text-sm font-medium transition-all hover:border-cyan-500 hover:text-cyan-500">
                Change
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
