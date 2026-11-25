import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('savoria_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem('savoria_user') }
    }
    setLoading(false)
  }, [])

  const login = useCallback((email, password) => {
    const storedUsers = JSON.parse(localStorage.getItem('savoria_users') || '[]')
    const found = storedUsers.find(u => u.email === email && u.password === password)
    if (found) {
      const safeUser = { id: found.id, name: found.name, email: found.email, avatar: found.avatar }
      localStorage.setItem('savoria_user', JSON.stringify(safeUser))
      setUser(safeUser)
      return { success: true }
    }
    return { success: false, message: 'Invalid email or password' }
  }, [])

  const register = useCallback((name, email, password) => {
    const storedUsers = JSON.parse(localStorage.getItem('savoria_users') || '[]')
    if (storedUsers.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered' }
    }
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F97316&color=fff&size=128`,
      createdAt: new Date().toISOString(),
    }
    storedUsers.push(newUser)
    localStorage.setItem('savoria_users', JSON.stringify(storedUsers))
    const safeUser = { id: newUser.id, name, email, avatar: newUser.avatar }
    localStorage.setItem('savoria_user', JSON.stringify(safeUser))
    setUser(safeUser)
    return { success: true }
  }, [])

  const updateProfile = useCallback((updates) => {
    if (!user) return
    const storedUsers = JSON.parse(localStorage.getItem('savoria_users') || '[]')
    const idx = storedUsers.findIndex(u => u.id === user.id)
    if (idx !== -1) {
      storedUsers[idx] = { ...storedUsers[idx], ...updates }
      localStorage.setItem('savoria_users', JSON.stringify(storedUsers))
    }
    const updatedUser = { ...user, ...updates }
    localStorage.setItem('savoria_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }, [user])

  const logout = useCallback(() => {
    localStorage.removeItem('savoria_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
