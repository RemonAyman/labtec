"use client"

import { useState, useEffect } from "react"
import { Link, useRouter, usePathname } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { useSession, signOut } from "next-auth/react"
import { useCart } from "@/store/use-cart"
import { useWishlist } from "@/store/use-wishlist"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  User, 
  LayoutDashboard, 
  ShieldAlert, 
  LogOut,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const t = useTranslations("Navigation")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  
  const cartItemsCount = useCart((state) => state.getItemCount())
  const wishlistCount = useWishlist((state) => state.items.length)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
    } else {
      router.push("/products")
    }
  }

  const switchLanguage = () => {
    const nextLocale = locale === "en" ? "ar" : "en"
    // Use window.location to trigger a clean reload with next-intl routing
    window.location.href = `/${nextLocale}${pathname}`
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: `/${locale}/login` })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-500/10 bg-background/70 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-1 rtl:space-x-reverse">
            <span className="text-2xl font-black tracking-tighter">
              LAP <span className="text-cyan-500">TEC</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link 
              href="/" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-cyan-500",
                pathname === "/" ? "text-cyan-500" : "text-muted-foreground"
              )}
            >
              {t("home")}
            </Link>
            <Link 
              href="/products" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-cyan-500",
                pathname.startsWith("/products") ? "text-cyan-500" : "text-muted-foreground"
              )}
            >
              {t("products")}
            </Link>
            <Link 
              href="/sell-laptop" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-cyan-500",
                pathname === "/sell-laptop" ? "text-cyan-500" : "text-muted-foreground"
              )}
            >
              {t("sellLaptop")}
            </Link>
          </nav>
        </div>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearchSubmit} className="hidden max-w-md flex-1 px-8 md:flex">
          <div className="relative w-full">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:right-3 rtl:left-auto" />
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/40 pl-9 pr-4 text-sm transition-all focus:bg-background focus:ring-1 focus:ring-cyan-500/50 rtl:pr-9 rtl:pl-4"
            />
          </div>
        </form>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-4">
          
          {/* Lang Selector */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={switchLanguage}
            className="hidden text-sm font-medium text-muted-foreground hover:text-cyan-500 xs:flex"
          >
            {locale === "en" ? "العربية" : "EN"}
          </Button>

          {/* Theme Switcher */}
          <ThemeToggle />

          {/* Wishlist */}
          <Link href="/wishlist" className="relative p-2 text-muted-foreground hover:text-cyan-500">
            <Heart className="h-5 w-5" />
            {mounted && wishlistCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white ring-2 ring-background">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/products?cart=true" className="relative p-2 text-muted-foreground hover:text-cyan-500">
            <ShoppingBag className="h-5 w-5" />
            {mounted && cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white ring-2 ring-background">
                {cartItemsCount}
              </span>
            )}
          </Link>

          {/* User Account / Dropdown */}
          {session ? (
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 focus:outline-none"
              >
                <Avatar className="h-8 w-8 ring-2 ring-cyan-500/20 transition-all hover:ring-cyan-500/50">
                  <AvatarImage src={session.user.image || ""} />
                  <AvatarFallback className="bg-cyan-500/10 text-cyan-500 font-semibold">
                    {session.user.name ? session.user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-cyan-500/10 bg-card/95 p-1 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 focus:outline-none rtl:left-0 rtl:right-auto animate-in fade-in-50 slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-cyan-500/5">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="truncate text-sm font-semibold text-foreground">{session.user.name}</p>
                  </div>
                  <Link 
                    href="/dashboard" 
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-cyan-500/10 hover:text-cyan-500"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>{t("dashboard")}</span>
                  </Link>

                  {session.user.role === "ADMIN" && (
                    <Link 
                      href="/admin" 
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-cyan-500 transition-all hover:bg-cyan-500/10"
                    >
                      <ShieldAlert className="h-4 w-4" />
                      <span>{t("admin")}</span>
                    </Link>
                  )}

                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-all hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t("logout")}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className="hidden rounded-full bg-cyan-600 px-5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-cyan-700 sm:block"
            >
              {t("login")}
            </Link>
          )}

          {/* Mobile Menu Icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-cyan-500/10 bg-background/95 backdrop-blur-xl px-4 py-4 md:hidden animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:right-3" />
              <Input
                type="search"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/60 pl-9 rtl:pr-9"
              />
            </div>
          </form>

          <nav className="flex flex-col space-y-3">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium hover:text-cyan-500"
            >
              {t("home")}
            </Link>
            <Link 
              href="/products" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium hover:text-cyan-500"
            >
              {t("products")}
            </Link>
            <Link 
              href="/sell-laptop" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium hover:text-cyan-500"
            >
              {t("sellLaptop")}
            </Link>
            <Button 
              variant="ghost" 
              onClick={switchLanguage}
              className="justify-start px-0 text-sm font-medium text-muted-foreground hover:text-cyan-500"
            >
              {locale === "en" ? "العربية" : "English"}
            </Button>
            {!session && (
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full bg-cyan-600 py-2 text-center text-xs font-semibold text-white transition-all hover:bg-cyan-700"
              >
                {t("login")}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
