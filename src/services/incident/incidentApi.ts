import type { IncidentsPageResponse, IncidentDTO } from './interfaceIncident'

// Reemplazo: usar VITE_INCIDENT_BASE directamente sin añadir /api/incidencias
const TOKEN_KEY = 'hf_token'
const INCIDENTS_BASE = (import.meta.env.VITE_INCIDENT_BASE || '').replace(/\/+$/,'')


export type GetIncidentsParams = {
	limit?: number
	lastKey?: string | null
	onlyMine?: boolean
}

export async function getIncidents(params?: GetIncidentsParams) {
	const token = localStorage.getItem(TOKEN_KEY)
	const qp: Record<string, string> = {}
	if (params?.limit) qp.limit = String(params.limit)
	if (params?.lastKey) qp.lastKey = String(params.lastKey)
	if (typeof params?.onlyMine === 'boolean') qp.onlyMine = String(params.onlyMine)

	const query = Object.keys(qp).length
		? `?${Object.entries(qp).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')}`
		: ''
	const url = `${INCIDENTS_BASE}${query}`

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

	// Try to parse JSON
	const raw: unknown = await res.json()

	// Normalize various acceptable shapes to the expected IncidentsPageResponse
	type UnknownObj = Record<string, unknown>
	const normalize = (input: unknown): IncidentsPageResponse | null => {
		const obj: UnknownObj | null = (typeof input === 'object' && input !== null) ? (input as UnknownObj) : null
		if (!obj) return null

		// Preferred: { items, lastKey, total, limit }
		const itemsPref = obj['items'] as unknown
		if (Array.isArray(itemsPref)) {
			const limitRaw = obj['limit'] as unknown
			const totalRaw = obj['total'] as unknown
			const limitNum = typeof limitRaw === 'string' ? Number(limitRaw) : limitRaw
			const totalNum = typeof totalRaw === 'string' ? Number(totalRaw) : totalRaw
			const lastKeyVal = (obj['lastKey'] as unknown) ?? null
			if (typeof limitNum === 'number') {
				return {
					items: itemsPref as IncidentDTO[],
					lastKey: (lastKeyVal === null || typeof lastKeyVal === 'string') ? lastKeyVal as (string | null) : String(lastKeyVal),
					total: typeof totalNum === 'number' ? totalNum : 0,
					limit: limitNum,
				}
			}
		}

		// Legacy: { data, meta }
		const dataLegacy = obj['data'] as unknown
		if (Array.isArray(dataLegacy)) {
			const meta = (obj['meta'] as UnknownObj | undefined) ?? {}
			const perPage = meta['per_page'] as unknown
			const totalRaw = meta['total'] as unknown
			const limitNum = typeof perPage === 'string' ? Number(perPage) : (typeof perPage === 'number' ? perPage : 10)
			const totalNum = typeof totalRaw === 'string' ? Number(totalRaw) : (typeof totalRaw === 'number' ? totalRaw : 0)
			const lastKeyVal = (meta['lastKey'] as unknown) ?? (meta['last_key'] as unknown) ?? null
			return {
				items: dataLegacy as IncidentDTO[],
				lastKey: (lastKeyVal === null || typeof lastKeyVal === 'string') ? lastKeyVal as (string | null) : String(lastKeyVal),
				total: typeof totalNum === 'number' ? totalNum : 0,
				limit: typeof limitNum === 'number' ? limitNum : 10,
			}
		}

		// Dynamo simple list: { incidents, count, message }
		const incidentsAlt = obj['incidents'] as unknown
		if (Array.isArray(incidentsAlt)) {
			const countRaw = obj['count'] as unknown
			const totalNum = typeof countRaw === 'string' ? Number(countRaw) : (typeof countRaw === 'number' ? countRaw : incidentsAlt.length)
			const lim = incidentsAlt.length
			return {
				items: incidentsAlt as IncidentDTO[],
				lastKey: null,
				total: typeof totalNum === 'number' ? totalNum : lim,
				limit: typeof lim === 'number' ? lim : 10,
			}
		}

		return null
	}

	const payload = normalize(raw)
	if (!payload) {
		// Help debugging in browser console without leaking to UI
		console.error('Invalid incidents response shape. Raw payload:', raw)
		throw new Error('Invalid incidents response shape')
	}
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
