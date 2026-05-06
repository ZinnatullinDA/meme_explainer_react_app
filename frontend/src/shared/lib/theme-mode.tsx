import type { PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type ThemeMode = 'light' | 'dark'

interface ThemeModeContextValue {
  mode: ThemeMode
  toggleMode: () => void
}

const THEME_MODE_STORAGE_KEY = 'meme-explainer-theme-mode'
const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

function getInitialThemeMode(): ThemeMode {
  const savedMode = localStorage.getItem(THEME_MODE_STORAGE_KEY)

  if (savedMode === 'dark' || savedMode === 'light') {
    return savedMode
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeModeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>(getInitialThemeMode)

  useEffect(() => {
    document.documentElement.dataset.theme = mode
    localStorage.setItem(THEME_MODE_STORAGE_KEY, mode)
  }, [mode])

  const value = useMemo<ThemeModeContextValue>(() => ({
    mode,
    toggleMode: () => setMode(currentMode => (currentMode === 'dark' ? 'light' : 'dark')),
  }), [mode])

  return (
    <ThemeModeContext value={value}>
      {children}
    </ThemeModeContext>
  )
}

export function useThemeMode() {
  const value = useContext(ThemeModeContext)

  if (!value) {
    throw new Error('useThemeMode must be used inside ThemeModeProvider')
  }

  return value
}
