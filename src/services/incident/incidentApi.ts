import type { IncidentsListResponse } from './interfaceIncident'

const API_BASE = '' // si se usa proxy en Vite, dejar vacío o poner la base URL
const TOKEN_KEY = 'hf_token'

function buildUrl(path: string, params?: Record<string, unknown>) {
	const url = new URL((API_BASE || '') + path, window.location.origin)
	if (params) {
		Object.keys(params).forEach(k => {
			const v = params[k]
			if (v === undefined || v === null) return
			url.searchParams.set(k, String(v))
		})
	}
	return url.toString()
}

export async function getIncidents(params?: Record<string, unknown>) {
	const token = localStorage.getItem(TOKEN_KEY)
	const url = buildUrl('/api/incidencias', params)
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
	})

	if (res.status === 401) throw new Error('Unauthorized')
	if (!res.ok) {
		const text = await res.text()
		throw new Error(text || 'Failed to fetch incidents')
	}

	const payload: IncidentsListResponse = await res.json()
	return payload
}

export default { getIncidents }
