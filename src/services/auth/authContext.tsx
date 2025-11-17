import { createContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { loginApi, registerApi } from './authApi'
import type { UserInfo, RegisterRequest } from './interfaceAuth'
import { decodeJwt } from './jwt'

type User = UserInfo

type RegisterPayload = RegisterRequest

import type { RegisterResponse } from './interfaceAuth'

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<RegisterResponse>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'hf_user'
const TOKEN_KEY = 'hf_token'

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

  const login = async (email: string, password: string) => {
    // Call backend auth API
    const res = await loginApi({ email, password })
    // store token for subsequent requests
    try {
      localStorage.setItem(TOKEN_KEY, res.token)
    } catch (e) {
      // ignore storage errors (e.g. quota, SSR)
      console.warn('could not persist token', e)
    }
    // Try to decode JWT to extract user claims like role, username, department
    const claims = decodeJwt<Record<string, unknown>>(res.token) || {}
    const c = claims as Record<string, unknown>
    const asStr = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined)
    const asStrArrHead = (v: unknown): string | undefined => (Array.isArray(v) && typeof v[0] === 'string' ? v[0] : undefined)
    const claimEmail = asStr(c.email) || asStr(c.sub) || email
    const claimUsername = asStr(c.username) || asStr(c.preferred_username) || asStr(c.name) || (typeof claimEmail === 'string' ? claimEmail.split('@')[0] : 'user')

    // Resolve role from common claim patterns
    const realmAccess = (c['realm_access'] && typeof c['realm_access'] === 'object') ? (c['realm_access'] as Record<string, unknown>) : undefined
    const roleFromClaims =
      asStr(c.role) ||
      asStrArrHead(c.roles) ||
      asStrArrHead(c.authorities) ||
      (realmAccess ? asStrArrHead(realmAccess.roles) : undefined) ||
      asStrArrHead(c['cognito:groups']) ||
      'User'

    const departmentFromClaims: string | null =
      asStr(c.department) || asStr(c.dept) || asStr(c['x-department']) || null

    const u: User = {
      username: claimUsername,
      email: claimEmail,
      name: (claims.name as string) || claimUsername,
      role: roleFromClaims,
      department: departmentFromClaims,
    }

    setUser(u)
  }

  const register = async (payload: RegisterPayload) => {
    // Call backend register API. registerApi will enforce defaults for role/department.
    const res = await registerApi(payload)
    // After successful registration, you may want to auto-login or return the response.
    // Here we'll set a minimal user object and keep the flow simple.
    const u: User = {
      username: payload.username,
      email: payload.email,
      name: payload.username,
      role: payload.role ?? 'User',
      department: payload.department ?? 'None',
    }
    setUser(u)
    return res
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch (err) {
      void err
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const AuthContextConsumer = AuthContext.Consumer
export default AuthContext
