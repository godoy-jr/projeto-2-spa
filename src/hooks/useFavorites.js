import { useEffect, useState } from 'react'

export const FAVORITES_STORAGE_KEY = 'cambio-facil:favorites:v1'

export function readFavorites(storage = globalThis.localStorage) {
  try {
    const value = JSON.parse(storage?.getItem(FAVORITES_STORAGE_KEY) ?? '[]')
    if (!Array.isArray(value)) return []
    return value.filter((item, index, list) => (
      item && /^[A-Z]{3}$/.test(item.source) && /^[A-Z]{3}$/.test(item.target)
      && item.source !== item.target
      && list.findIndex((candidate) => candidate.source === item.source && candidate.target === item.target) === index
    ))
  } catch {
    return []
  }
}

export function useFavorites(storage = globalThis.localStorage) {
  const [favorites, setFavorites] = useState(() => readFavorites(storage))

  useEffect(() => {
    try {
      storage?.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // A interface continua utilizável quando o armazenamento está indisponível.
    }
  }, [favorites, storage])

  function toggleFavorite(source, target) {
    if (!source || !target || source === target) return
    setFavorites((current) => {
      const exists = current.some((item) => item.source === source && item.target === target)
      return exists
        ? current.filter((item) => item.source !== source || item.target !== target)
        : [...current, { source, target }]
    })
  }

  return { favorites, toggleFavorite }
}
