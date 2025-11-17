import { useEffect, useMemo, useState } from 'react'
import SlideOver from '../../components/SlideOver'
import IncidentCard from '../../components/incidentCard'
import type { Incident } from '../../services/incident/interfaceIncident'
import { getIncidents } from '../../services/incident/incidentApi'
import useAuth from '../../services/auth/useAuth'

export type IncidentsSlideOverProps = {
  open: boolean
  onClose: () => void
  initialQuery?: string
}

const IncidentsSlideOver: React.FC<IncidentsSlideOverProps> = ({ open, onClose, initialQuery }) => {
  const { user } = useAuth()
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<{page?: number; per_page?: number; total?: number}>({})

  const totalPages = useMemo(() => Math.max(1, Math.ceil((meta.total || 0) / (meta.per_page || 10))), [meta])

  const load = async (p = 1, q?: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await getIncidents({ page: p, per_page: 10, ...(q ? { q } : {}) })
      setIncidents(res.data || [])
      if (res.meta) setMeta(res.meta)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg || 'Error cargando incidencias')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) return
    void load(1, initialQuery)
  }, [open, initialQuery])

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <b>Incidencias reportadas</b>
        </div>
      }
      description={user ? `Sesión: ${user.email} (${user.role ?? 'User'})` : undefined}
      width={640}
    >
      {loading && <div className="text-sm text-gray-500">Cargando incidencias...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {!loading && !error && incidents.length === 0 && (
        <div className="text-sm text-gray-500">No hay incidencias para mostrar.</div>
      )}
      <div className="mt-3" style={{ display: 'grid', gap: '.6rem' }}>
        {incidents.map((inc) => (
          <IncidentCard key={String(inc.id)} incident={inc} user={user} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', marginTop: '.75rem' }}>
        <button className="nav-button" disabled={page <= 1} onClick={() => { const np = Math.max(1, page - 1); setPage(np); void load(np, initialQuery) }}>Anterior</button>
        <div style={{ fontSize: '.9rem' }}>{`Página ${meta.page || page} de ${totalPages}`}</div>
        <button className="nav-button" disabled={page >= totalPages} onClick={() => { const np = Math.min(totalPages, page + 1); setPage(np); void load(np, initialQuery) }}>Siguiente</button>
      </div>
    </SlideOver>
  )
}

export default IncidentsSlideOver
