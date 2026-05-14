"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { User, Mail, Phone, MapPin } from "lucide-react"

export default function ProfilePage() {
  const t = useTranslations("Dashboard")
  const tCommon = useTranslations("Common")

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">{t("profile")}</h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Avatar Section */}
        <Card className="mb-6 border-cyan-500/10 bg-card/50">
          <CardContent className="flex items-center gap-6 p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-500">
              <User className="h-10 w-10" />
            </div>
            <div>
              <p className="text-xl font-bold">Remon Ayman</p>
              <p className="text-sm text-muted-foreground">remon@example.com</p>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="border-cyan-500/10 bg-card/50">
          <CardHeader>
            <CardTitle>{t("profile")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <User className="mr-1 inline h-3.5 w-3.5" /> Name
                </Label>
                <Input id="name" defaultValue="Remon Ayman" className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="mr-1 inline h-3.5 w-3.5" /> Email
                </Label>
                <Input id="email" type="email" defaultValue="remon@example.com" className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="mr-1 inline h-3.5 w-3.5" /> Phone
                </Label>
                <Input id="phone" defaultValue="+20 123 456 7890" className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">
                  <MapPin className="mr-1 inline h-3.5 w-3.5" /> Address
                </Label>
                <Input id="address" defaultValue="Cairo, Egypt" className="bg-background/50" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline">{tCommon("cancel")}</Button>
              <Button className="bg-cyan-600 hover:bg-cyan-700">{tCommon("save")}</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
