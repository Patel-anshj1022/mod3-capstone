import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      apiRequest('/auth/me', { token }).then((data) => setUser(data.user)).catch(() => {})
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const data = await apiRequest('/auth/login', { method: 'POST', body: { email, password } })
      setToken(data.accessToken)
      setUser(data.user)
      return data.user
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name, email, password) => {
    setLoading(true)
    try {
      await apiRequest('/auth/signup', { method: 'POST', body: { name, email, password } })
      return await login(email, password)
    } finally { setLoading(false) }
  }

  const logout = async () => {
    await apiRequest('/auth/logout', { method: 'POST' })
    setToken('')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }