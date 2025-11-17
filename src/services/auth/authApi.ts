import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from './interfaceAuth'

const AUTH_BASE = (import.meta.env.VITE_AUTH_BASE as string) || '/api/auth'

export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
	const res = await fetch(`${AUTH_BASE}/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email: payload.email, password: payload.password }),
	})

	if (!res.ok) {
		const txt = await res.text()
		throw new Error(txt || `Login failed with status ${res.status}`)
	}

	const data = await res.json()
	return data as LoginResponse
}

export async function registerApi(payload: RegisterRequest): Promise<RegisterResponse> {
	// enforce defaults required by API, normalizing role case-insensitively
	const roleMap: Record<string, string> = { user: 'User', admin: 'Admin', worker: 'Worker' }
	const normalizedRole = payload.role
		? roleMap[payload.role.toLowerCase()] ?? payload.role
		: 'User'

	const body = {
		email: payload.email,
		username: payload.username,
		password: payload.password,
		role: normalizedRole,
		department: payload.department ?? 'None',
	}

	// Optional Authorization header (useful when registering trabajadores desde Admin)
	const headers: Record<string, string> = { 'Content-Type': 'application/json' }
	try {
		const token = localStorage.getItem('hf_token')
		if (token) headers.Authorization = `Bearer ${token}`
	} catch {
		// ignore storage errors (SSR or private mode)
	}

	const res = await fetch(`${AUTH_BASE}/register`, {
		method: 'POST',
		headers,
		body: JSON.stringify(body),
	})

	if (!res.ok) {
		const txt = await res.text()
		throw new Error(txt || `Register failed with status ${res.status}`)
	}

	const data = await res.json()
	return data as RegisterResponse
}

export default { loginApi, registerApi }
