"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Laptop, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  const t = useTranslations("Common")
  const tNav = useTranslations("Navigation")

  return (
    <footer className="border-t border-cyan-500/10 bg-card/30 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 sm:grid-cols-2">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <Laptop className="h-6 w-6 text-cyan-500" />
              <span className="text-xl font-black tracking-tighter">
                LAP <span className="text-cyan-500">TEC</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Egypt's premium laptop marketplace. Buy and sell brand new or certified used high-performance laptops with absolute security and confidence.
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="text-muted-foreground hover:text-cyan-500 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-cyan-500 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-cyan-500 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-cyan-500 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">
              Marketplace
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-cyan-500 transition-colors">
                  {tNav("home")}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-cyan-500 transition-colors">
                  {tNav("products")}
                </Link>
              </li>
              <li>
                <Link href="/sell-laptop" className="text-sm text-muted-foreground hover:text-cyan-500 transition-colors">
                  {tNav("sellLaptop")}
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-sm text-muted-foreground hover:text-cyan-500 transition-colors">
                  {tNav("wishlist")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-cyan-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-cyan-500 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-cyan-500 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-cyan-500 transition-colors">
                  {tNav("dashboard")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">
              Get in Touch
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-cyan-500 shrink-0" />
                <span className="text-sm text-muted-foreground">Cairo, New Cairo City, Egypt</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-cyan-500 shrink-0" />
                <span className="text-sm text-muted-foreground" dir="ltr">+20 100 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-cyan-500 shrink-0" />
                <span className="text-sm text-muted-foreground">support@laptec.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-cyan-500/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {t("rights")}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Powered by Next.js 16</span>
            <span className="text-cyan-500/30">|</span>
            <span>Stripe Payments Integrated</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
