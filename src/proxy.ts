import createMiddleware from "next-intl/middleware"
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)
const { auth } = NextAuth(authConfig)

const protectedRoutes = ["/dashboard", "/checkout", "/admin", "/sell-laptop"]

export default auth(function proxy(req) {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const pathname = nextUrl.pathname

  // Remove locale prefix to match protected routes correctly
  const cleanPathname = pathname.replace(/^\/(en|ar)/, "")

  const isProtected = protectedRoutes.some((route) =>
    cleanPathname.startsWith(route)
  )

  if (isProtected) {
    if (!isLoggedIn) {
      let loginUrl = "/login"
      const locale = pathname.split("/")[1]
      if (locale === "ar" || locale === "en") {
        loginUrl = `/${locale}/login`
      } else {
        loginUrl = `/en/login`
      }
      return NextResponse.redirect(new URL(loginUrl, req.url))
    }

    if (cleanPathname.startsWith("/admin")) {
      const userRole = req.auth?.user?.role
      if (userRole !== "ADMIN") {
        let homeUrl = "/"
        const locale = pathname.split("/")[1]
        if (locale === "ar" || locale === "en") {
          homeUrl = `/${locale}`
        } else {
          homeUrl = `/en`
        }
        return NextResponse.redirect(new URL(homeUrl, req.url))
      }
    }
  }

  return intlMiddleware(req)
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public|images).*)"],
}
