import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('savoria_favorites')
    if (stored) {
      try { setFavorites(JSON.parse(stored)) } catch { localStorage.removeItem('savoria_favorites') }
    }
  }, [])

  const persist = useCallback((favs) => {
    setFavorites(favs)
    localStorage.setItem('savoria_favorites', JSON.stringify(favs))
  }, [])

  const toggleFavorite = useCallback((recipe) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === recipe.id)
      const next = exists ? prev.filter(f => f.id !== recipe.id) : [...prev, recipe]
      localStorage.setItem('savoria_favorites', JSON.stringify(next))
      return next
    })
  }, [])

  const isFavorite = useCallback((id) => favorites.some(f => f.id === id), [favorites])

  const removeFavorite = useCallback((id) => {
    setFavorites(prev => {
      const next = prev.filter(f => f.id !== id)
      localStorage.setItem('savoria_favorites', JSON.stringify(next))
      return next
    })
  }, [])

  const clearFavorites = useCallback(() => {
    setFavorites([])
    localStorage.removeItem('savoria_favorites')
  }, [])

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, removeFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
