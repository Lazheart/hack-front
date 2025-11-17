import type { IncidentsListResponse } from './interfaceIncident'

// Reemplazo: usar VITE_INCIDENT_BASE directamente sin añadir /api/incidencias
const TOKEN_KEY = 'hf_token'
const INCIDENTS_BASE = (import.meta.env.VITE_INCIDENT_BASE || '').replace(/\/+$/,'')


export async function getIncidents(params?: Record<string, unknown>) {
	const token = localStorage.getItem(TOKEN_KEY)
	const url = params && Object.keys(params).length
		? `${INCIDENTS_BASE}?${Object.entries(params)
			.filter(([, v]) => v !== undefined && v !== null)
			.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
			.join('&')}`
		: INCIDENTS_BASE
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

export interface CreateIncidentPayload {
	category: string
	place: string
	description: string
	urgency?: 'low' | 'medium' | 'high'
}

export interface CreateIncidentResponse {
	message: string
	incident: {
		incidentId: string
		createdAt: string
		createdBy: string
		solvedBy: string | null
		solvedAt: string | null
		category: string
		status: string
		urgency: string
		place: string
		description: string
	}
}

export async function createIncident(data: CreateIncidentPayload) {
	const token = localStorage.getItem(TOKEN_KEY)
	const url = INCIDENTS_BASE
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		body: JSON.stringify(data),
	})

	if (res.status === 401) throw new Error('Unauthorized')
	if (!res.ok) {
		const text = await res.text()
		throw new Error(text || 'Failed to create incident')
	}
	const payload: CreateIncidentResponse = await res.json()
	return payload
}

export default { getIncidents, createIncident }
