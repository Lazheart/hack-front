import { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Incident } from '../../services/incident/interfaceIncident'
import { getIncidents } from '../../services/incident/incidentApi'
import IncidentCard from '../../components/incidentCard'
import useAuth from '../../services/auth/useAuth'

const BodyDashboard = () => {
  const { user } = useAuth()
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const [meta, setMeta] = useState<{page?: number; per_page?: number; total?: number}>({})
  const location = useLocation()
  const navigate = useNavigate()

  const load = useCallback(async (opts?: { page?: number; q?: string }) => {
    setLoading(true)
    setError(null)
    try {
      const params: Record<string, unknown> = { per_page: 10 }
      if (opts?.page) params.page = opts.page
      const q = opts?.q
      if (q) params.q = q
      const res = await getIncidents(params)
      setIncidents(res.data || [])
      if (res.meta) setMeta(res.meta)
    } catch (err: unknown) {
  const msg = err instanceof Error ? err.message : String(err)
  setError(msg || 'Error cargando incidencias')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // si queremos precargar, descomentar
    // void load()
  }, [load])

  // react to query params (q, page)
  useEffect(() => {
    const sp = new URLSearchParams(location.search)
    const q = sp.get('q') || undefined
    const page = sp.get('page') ? Number(sp.get('page')) : undefined
    // if there's a query (search) or page in the URL, ensure the incidents panel is visible and load
    if (q || page) {
      if (!visible) setVisible(true)
      void load({ page, q })
      return
    }
    // otherwise, if the panel is already visible, load without query
    if (visible) void load()
  }, [location.search, visible, load])

  const onToggle = async () => {
    const next = !visible
    setVisible(next)
    if (next && incidents.length === 0) await load()
  }

  const goToPage = (p: number) => {
    const sp = new URLSearchParams(location.search)
    if (p > 0) sp.set('page', String(p))
    else sp.delete('page')
    navigate(`/dashboard?${sp.toString()}`)
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          {visible ? 'Ocultar incidencias' : 'Ver incidencias reportadas'}
        </button>
        <div className="text-sm text-gray-600">{user ? `Sesión: ${user.email} (${user.role ?? 'User'})` : 'No autenticado'}</div>
      </div>

      <div className="mt-4">
        {visible && (
          <div>
            {loading && <div className="text-sm text-gray-500">Cargando incidencias...</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}

            {!loading && !error && incidents.length === 0 && (
              <div className="text-sm text-gray-500">No hay incidencias para mostrar.</div>
            )}

            <div className="mt-3">
              {incidents.map(inc => (
                <IncidentCard key={String(inc.id)} incident={inc} user={user} />
              ))}
            </div>
            {/* Paginated controls (simple) */}
            {meta && (
              <div style={{display: 'flex', gap: '.5rem', alignItems: 'center', marginTop: '0.75rem'}}>
                <button onClick={() => goToPage((meta.page || 1) - 1)} disabled={(meta.page || 1) <= 1} className="nav-button">Anterior</button>
                <div style={{fontSize: '0.9rem'}}>{`Página ${meta.page || 1} de ${Math.max(1, Math.ceil((meta.total || 0) / (meta.per_page || 10)))}`}</div>
                <button onClick={() => goToPage((meta.page || 1) + 1)} disabled={((meta.page || 1) * (meta.per_page || 10)) >= (meta.total || 0)} className="nav-button">Siguiente</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default BodyDashboard
