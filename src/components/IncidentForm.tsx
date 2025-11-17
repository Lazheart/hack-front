import React, { useState } from 'react'
import { createIncident, type CreateIncidentPayload } from '../services/incident/incidentApi'
import useAuth from '../services/auth/useAuth'

export interface IncidentFormProps {
  onCreated?: (incidentId: string) => void
  inline?: boolean // styling variant
  onCancel?: () => void
}

const allowedCategories = ['IT', 'Cleaner', 'Infrastructure', 'Security', 'Emergency']
const allowedUrgency: Array<CreateIncidentPayload['urgency']> = ['low', 'medium', 'high']

const IncidentForm: React.FC<IncidentFormProps> = ({ onCreated, inline = false, onCancel }) => {
  const { user } = useAuth()
  const [category, setCategory] = useState('IT')
  const [place, setPlace] = useState('')
  const [description, setDescription] = useState('')
  const [urgency, setUrgency] = useState<CreateIncidentPayload['urgency']>('low')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successId, setSuccessId] = useState<string | null>(null)

  const canSubmit = category && place.trim() && description.trim() && urgency

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || loading) return
    setLoading(true)
    setError(null)
    try {
      const payload: CreateIncidentPayload = { category, place: place.trim(), description: description.trim(), urgency }
      const res = await createIncident(payload)
      setSuccessId(res.incident.incidentId)
      setPlace('')
      setDescription('')
      if (onCreated) onCreated(res.incident.incidentId)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg || 'Error creando incidencia')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className={inline ? 'incident-form-inline' : 'incident-form-card'} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{display:'flex', flexWrap:'wrap', gap:'0.75rem'}}>
        <div style={{flex:'1 1 160px', minWidth:160}}>
          <label className="if-label">Categoría</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="if-input">
            {allowedCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{flex:'1 1 160px', minWidth:160}}>
          <label className="if-label">Urgencia</label>
          <select value={urgency} onChange={e => setUrgency(e.target.value as CreateIncidentPayload['urgency'])} className="if-input">
            {allowedUrgency.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="if-label">Lugar / Área</label>
        <input value={place} onChange={e => setPlace(e.target.value)} placeholder="Ej: Laboratorio 3" className="if-input" required />
      </div>
      <div>
        <label className="if-label">Descripción</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe brevemente la incidencia" className="if-input" required />
      </div>
      {user && <div className="if-meta">Reportará: <b>{user.email}</b></div>}
      {error && <div className="if-error">{error}</div>}
      {successId && <div className="if-success">Incidencia creada (ID: {successId})</div>}
      <div style={{display:'flex', gap:'.6rem', flexWrap:'wrap'}}>
        {onCancel && (
          <button type="button" onClick={onCancel} className="if-btn if-btn-secondary">Cancelar</button>
        )}
        <button disabled={!canSubmit || loading} className="if-btn if-btn-primary" type="submit">
          {loading ? 'Creando…' : 'Crear incidencia'}
        </button>
      </div>
    </form>
  )
}

export default IncidentForm
