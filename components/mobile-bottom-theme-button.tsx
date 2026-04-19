"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

/** Light/dark toggle for the mobile bottom bar (thumb reach). */
export function MobileBottomThemeButton() {
  const { theme, setTheme } = useTheme()

  function toggleColorTheme() {
    if (theme === "dark") setTheme("light")
    else if (theme === "light") setTheme("dark")
    else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
      setTheme(prefersDark ? "light" : "dark")
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="relative h-12 w-12 shrink-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      aria-label="Toggle color theme"
      onClick={toggleColorTheme}
    >
      <Sun className="h-6 w-6 rotate-0 scale-100 transition-transform dark:rotate-90 dark:scale-0" />
      <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
