import { createContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

type User = {
  username?: string
  email: string
  name?: string
  role?: string | null
  department?: string | null
}

type RegisterPayload = {
  username: string
  email: string
  password: string
  role?: string
  department?: string | null
}

type AuthContextType = {
  user: User | null
  login: (email: string, password?: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'hf_user'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  const login = async (email: string) => {
    // Aquí va la lógica real (llamar a authApi). Por ahora simulamos.
    const u: User = { email, name: email.split('@')[0], role: 'user', department: null }
    setUser(u)
  }

  const register = async (payload: RegisterPayload) => {
    // Simula registro. En producción debes llamar a authApi.register(payload)
    const u: User = {
      username: payload.username,
      email: payload.email,
      name: payload.username,
      role: payload.role ?? 'user',
      department: payload.department ?? null,
    }
    setUser(u)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const AuthContextConsumer = AuthContext.Consumer
export default AuthContext
