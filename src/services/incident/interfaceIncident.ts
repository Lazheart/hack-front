// Legacy types (kept to not break other parts that may still import them)
export type Priority = 'baja' | 'media' | 'alta' | 'critica'
export type Estado = 'abierto' | 'en_progreso' | 'resuelto' | 'cerrado'

export interface Incident {
  id: string | number
  titulo: string
  descripcion?: string
  prioridad?: Priority
  estado?: Estado
  categoria?: string | null
  reporter_id?: string | number | null
  assignee_id?: string | number | null
  created_at?: string
  updated_at?: string
  due_date?: string | null
  tags?: string[]
}

export interface IncidentsListResponse {
  data: Incident[]
  meta?: { page?: number; per_page?: number; total?: number }
}

// New DTOs matching backend EXACT shape
export interface IncidentDTO {
  incidentId: string
  createdAt: string
  category: string
  status: string
  urgency: string
  createdBy: string
  solvedBy: string | null
  solvedAt: string | null
}

export interface IncidentsPageResponse {
  items: IncidentDTO[]
  lastKey: string | null
  total: number
  limit: number
}
