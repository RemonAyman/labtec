import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      return true
    },
  },
  providers: [], // Providers list is filled in auth.ts
} satisfies NextAuthConfig
