"use client"

import * as React from "react"

type Theme = "dark" | "light" | "system"

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "dark" | "light"
}

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
})

export function useTheme() {
  return React.useContext(ThemeContext)
}

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "laptec-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<"dark" | "light">("light")
  const [mounted, setMounted] = React.useState(false)

  // Read from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null
    if (stored && ["dark", "light", "system"].includes(stored)) {
      setThemeState(stored)
    }
    setMounted(true)
  }, [storageKey])

  // Apply theme class to <html>
  React.useEffect(() => {
    if (!mounted) return

    const root = document.documentElement

    const applyTheme = (t: "dark" | "light") => {
      root.classList.remove("dark", "light")
      root.classList.add(t)
      setResolvedTheme(t)
    }

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)")
      applyTheme(mq.matches ? "dark" : "light")

      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches ? "dark" : "light")
      mq.addEventListener("change", handler)
      return () => mq.removeEventListener("change", handler)
    } else {
      applyTheme(theme)
    }
  }, [theme, mounted])

  const setTheme = React.useCallback(
    (t: Theme) => {
      localStorage.setItem(storageKey, t)
      setThemeState(t)
    },
    [storageKey]
  )

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
