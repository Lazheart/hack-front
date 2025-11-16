import { useEffect, useState, useCallback } from 'react'
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

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getIncidents({ per_page: 10 })
      setIncidents(res.data || [])
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

  const onToggle = async () => {
    const next = !visible
    setVisible(next)
    if (next && incidents.length === 0) await load()
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
          </div>
        )}
      </div>
    </div>
  )
}

export default BodyDashboard
