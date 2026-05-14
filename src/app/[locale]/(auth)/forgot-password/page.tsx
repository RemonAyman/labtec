"use client"

import { useState } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { toast } from "sonner"
import { Loader2, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const t = useTranslations("Auth")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      toast.success("Check your email for reset instructions")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-background to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-cyan-500/20 bg-background/50 backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "-ml-2 mb-2 w-fit flex items-center text-xs")}>
              <ArrowLeft className="mr-2 h-3 w-3 rtl:rotate-180" />
              Back to Login
            </Link>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Reset Password
            </CardTitle>
            <CardDescription>
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="bg-background/50"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Reset Link
                </Button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-2">
                <p className="font-semibold text-green-500">Email Sent!</p>
                <p className="text-sm text-muted-foreground">
                  We've sent a recovery link to your email address.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
