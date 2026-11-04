import { useEffect, useState } from 'react'

export const THEME_STORAGE_KEY = 'cambio-facil:theme:v1'
export const THEMES = ['light', 'dark', 'system']

export function readTheme(storage = globalThis.localStorage) {
  try {
    const saved = storage?.getItem(THEME_STORAGE_KEY)
    return THEMES.includes(saved) ? saved : 'system'
  } catch {
    return 'system'
  }
}

export function resolveTheme(theme, matchMedia = globalThis.matchMedia) {
  if (theme !== 'system') return theme
  return matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme(storage = globalThis.localStorage, matchMedia = globalThis.matchMedia) {
  const [theme, setTheme] = useState(() => readTheme(storage))
  const [resolvedTheme, setResolvedTheme] = useState(() => resolveTheme(theme, matchMedia))

  useEffect(() => {
    const media = matchMedia?.('(prefers-color-scheme: dark)')
    const applyTheme = () => {
      const resolved = theme === 'system' && media?.matches ? 'dark' : theme === 'system' ? 'light' : theme
      setResolvedTheme(resolved)
      document.documentElement.dataset.theme = resolved
      document.documentElement.style.colorScheme = resolved
    }
    applyTheme()
    if (theme === 'system') media?.addEventListener?.('change', applyTheme)
    try { storage?.setItem(THEME_STORAGE_KEY, theme) } catch { /* tema continua ativo na sessão */ }
    return () => media?.removeEventListener?.('change', applyTheme)
  }, [matchMedia, storage, theme])

  return { theme, resolvedTheme, setTheme }
}
