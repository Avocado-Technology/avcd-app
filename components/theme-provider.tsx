'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
}>({
  theme: 'system',
  setTheme: () => null,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('avcd-theme')
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      setTheme(stored as Theme)
    }
  }, [])

  // Apply theme class to HTML and save to localStorage
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('avcd-theme', theme)
    
    // Apply class to HTML
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
