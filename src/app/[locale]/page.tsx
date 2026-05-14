import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button, buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { 
  Laptop, 
  User, 
  Heart, 
  ShoppingBag, 
  ArrowRight,
  ShieldCheck
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 inline-flex items-center rounded-full bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-500">
          <ShieldCheck className="mr-2 h-4 w-4" />
          Premium Laptop Marketplace
        </div>
        
        <h1 className="mb-6 text-5xl font-extrabold tracking-tighter sm:text-7xl">
          LAP <span className="text-cyan-500">TEC</span>
        </h1>
        
        <p className="mb-8 max-w-[600px] text-lg text-muted-foreground sm:text-xl">
          The ultimate destination for high-performance laptops. 
          Experience the future of tech commerce.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "bg-cyan-600 hover:bg-cyan-700 px-8")}>
            Get Started <ArrowRight className="ml-2 h-4 w-4 rtl:rotate-180" />
          </Link>
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-cyan-500/20 hover:bg-cyan-500/5")}>
            View Dashboard
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard" className="group rounded-2xl border border-cyan-500/10 bg-card/50 p-8 transition-all hover:border-cyan-500/50">
            <User className="mb-4 h-10 w-10 text-cyan-500" />
            <h3 className="mb-2 text-xl font-bold">User Dashboard</h3>
            <p className="text-sm text-muted-foreground">Manage your profile, orders, and settings in one place.</p>
          </Link>
          
          <Link href="/wishlist" className="group rounded-2xl border border-cyan-500/10 bg-card/50 p-8 transition-all hover:border-cyan-500/50">
            <Heart className="mb-4 h-10 w-10 text-cyan-500" />
            <h3 className="mb-2 text-xl font-bold">Wishlist</h3>
            <p className="text-sm text-muted-foreground">Save your favorite laptops for later and track price drops.</p>
          </Link>

          <Link href="/orders/TRACK-123" className="group rounded-2xl border border-cyan-500/10 bg-card/50 p-8 transition-all hover:border-cyan-500/50">
            <ShoppingBag className="mb-4 h-10 w-10 text-cyan-500" />
            <h3 className="mb-2 text-xl font-bold">Order Tracking</h3>
            <p className="text-sm text-muted-foreground">Real-time updates on your delivery status and history.</p>
          </Link>
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>© 2026 Lap Tec. All rights reserved.</p>
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
