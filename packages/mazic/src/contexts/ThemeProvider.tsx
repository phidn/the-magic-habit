import { createContext, useContext, useEffect, useState } from 'react'

type TTheme = 'dark' | 'light' | 'system'
type TMode = 'dark' | 'light'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: TTheme
  storageKey?: string
}

type ThemeProviderState = {
  theme: TTheme
  setTheme: (theme: TTheme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export const ThemeProvider = ({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<TTheme>(
    () => (localStorage.getItem(storageKey) as TTheme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: TTheme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const { theme, setTheme } = useContext(ThemeProviderContext)

  const mode: TMode = theme === 'dark' ? 'dark' : 'light'

  return {
    theme,
    mode,
    setTheme,
  }
}
