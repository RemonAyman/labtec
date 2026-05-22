import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { 
  Laptop, 
  User, 
  Heart, 
  ShoppingBag, 
  ArrowRight,
  ShieldCheck
} from "lucide-react"
import { auth } from "@/auth"

export default async function HomePage() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.id
  const t = useTranslations("HomePage")
  const tCommon = useTranslations("Common")

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 inline-flex items-center rounded-full bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-500">
          <ShieldCheck className="mr-2 h-4 w-4" />
          {t("badge")}
        </div>
        
        <h1 className="mb-6 text-5xl font-extrabold tracking-tighter sm:text-7xl">
          {t("titlePrefix")}<span className="text-cyan-500">{t("titleSuffix")}</span>
        </h1>
        
        <p className="mb-8 max-w-[600px] text-lg text-muted-foreground sm:text-xl">
          {t("description")}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href={isLoggedIn ? "/dashboard" : "/login"} className={cn(buttonVariants({ size: "lg" }), "bg-cyan-600 hover:bg-cyan-700 px-8")}>
            {t("getStarted")} <ArrowRight className="ml-2 h-4 w-4 rtl:rotate-180" />
          </Link>
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-cyan-500/20 hover:bg-cyan-500/5")}>
            {t("viewDashboard")}
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard" className="group rounded-2xl border border-cyan-500/10 bg-card/50 p-8 transition-all hover:border-cyan-500/50">
            <User className="mb-4 h-10 w-10 text-cyan-500" />
            <h3 className="mb-2 text-xl font-bold">{t("dashboardTitle")}</h3>
            <p className="text-sm text-muted-foreground">{t("dashboardDesc")}</p>
          </Link>
          
          <Link href="/wishlist" className="group rounded-2xl border border-cyan-500/10 bg-card/50 p-8 transition-all hover:border-cyan-500/50">
            <Heart className="mb-4 h-10 w-10 text-cyan-500" />
            <h3 className="mb-2 text-xl font-bold">{t("wishlistTitle")}</h3>
            <p className="text-sm text-muted-foreground">{t("wishlistDesc")}</p>
          </Link>

          <Link href="/orders/TRACK-123" className="group rounded-2xl border border-cyan-500/10 bg-card/50 p-8 transition-all hover:border-cyan-500/50">
            <ShoppingBag className="mb-4 h-10 w-10 text-cyan-500" />
            <h3 className="mb-2 text-xl font-bold">{t("trackingTitle")}</h3>
            <p className="text-sm text-muted-foreground">{t("trackingDesc")}</p>
          </Link>
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>{tCommon("rights")}</p>
        <div className="mt-2 flex items-center justify-center space-x-4 rtl:space-x-reverse">
          <Link href="/" locale="ar" className="hover:text-cyan-500">العربية</Link>
          <Link href="/" locale="en" className="hover:text-cyan-500">English</Link>
          <span className="text-muted-foreground/30">|</span>
          <ThemeToggle />
        </div>
      </footer>
    </div>
  )
}
