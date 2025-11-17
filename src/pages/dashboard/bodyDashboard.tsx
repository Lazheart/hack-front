import { useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import type { IncidentDTO } from '../../services/incident/interfaceIncident'
import { getIncidents } from '../../services/incident/incidentApi'
import IncidentCard from '../../components/incidentCard'
import useAuth from '../../services/auth/useAuth'

const BodyDashboard = () => {
  const { user } = useAuth()
  const [allIncidents, setAllIncidents] = useState<IncidentDTO[]>([])
  const [filteredIncidents, setFilteredIncidents] = useState<IncidentDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  // Cursor pagination
  const [limit] = useState(10)
  // track current cursor (for clarity, we rely on keysStack[cursorIndex])
  const [nextKey, setNextKey] = useState<string | null>(null)
  const [keysStack, setKeysStack] = useState<(string | null)[]>([null]) // history of cursors
  const [cursorIndex, setCursorIndex] = useState(0)
  const [onlyMine, setOnlyMine] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const location = useLocation()
  

  const applyLocalFilter = useCallback((items: IncidentDTO[], term: string) => {
    const q = term.trim().toLowerCase()
    if (!q) return items
    return items.filter(inc => (
      inc.incidentId.toLowerCase().includes(q) ||
      inc.category.toLowerCase().includes(q) ||
      inc.status.toLowerCase().includes(q) ||
      inc.createdBy.toLowerCase().includes(q) ||
      inc.createdAt.toLowerCase().includes(q)
    ))
  }, [])

  const load = useCallback(async (opts?: { cursor?: string | null }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await getIncidents({ limit, lastKey: opts?.cursor ?? null, onlyMine })
      const items = res.items || []
      setAllIncidents(items)
      setFilteredIncidents(applyLocalFilter(items, searchTerm))
      setNextKey(res.lastKey ?? null)
    } catch (err: unknown) {
  const msg = err instanceof Error ? err.message : String(err)
  setError(msg || 'Error cargando incidencias')
    } finally {
      setLoading(false)
    }
  }, [limit, onlyMine, searchTerm, applyLocalFilter])

  useEffect(() => {
    // si queremos precargar, descomentar
    // void load()
  }, [load])

  // react to query params (q, page)
  useEffect(() => {
    const sp = new URLSearchParams(location.search)
    const q = sp.get('q') || ''
    setSearchTerm(q)
    // if there's a query, ensure the incidents panel is visible
    if (q) {
      if (!visible) setVisible(true)
      // don't send q to backend; it is a local search
      void load({ cursor: keysStack[cursorIndex] })
      return
    }
    // otherwise, if the panel is already visible, load without query
    if (visible) void load({ cursor: keysStack[cursorIndex] })
  }, [location.search, visible, load, keysStack, cursorIndex])

  // Removed inline toggle button. Visibility now changes only via URL params (q, page) or external triggers.

  const goPrev = () => {
    if (cursorIndex <= 0) return
    const newIndex = cursorIndex - 1
    setCursorIndex(newIndex)
    void load({ cursor: keysStack[newIndex] })
  }

  const goNext = () => {
    if (!nextKey) return
    // if moving forward from the end of the stack, push nextKey
    setKeysStack(prev => {
      const copy = prev.slice(0, cursorIndex + 1)
      copy.push(nextKey)
      return copy
    })
    const newIndex = cursorIndex + 1
    setCursorIndex(newIndex)
    void load({ cursor: nextKey })
  }

  const toggleOnlyMine = () => {
    setOnlyMine(v => !v)
    // reset pagination when toggling scope
    setKeysStack([null])
    setCursorIndex(0)
    void load({ cursor: null })
  }

  useEffect(() => {
    // Re-apply local filter when searchTerm or items change
    setFilteredIncidents(applyLocalFilter(allIncidents, searchTerm))
  }, [allIncidents, searchTerm, applyLocalFilter])

  return (
    <div>
      <div className="text-sm text-gray-600">{user ? `Sesión: ${user.email} (${user.role ?? 'User'})` : 'No autenticado'}</div>

      <div className="mt-4">
        {visible && (
          <div>
            {loading && <div className="text-sm text-gray-500">Cargando incidencias...</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}

            {!loading && !error && filteredIncidents.length === 0 && (
              <div className="text-sm text-gray-500">No hay incidencias para mostrar.</div>
            )}

            <div className="mt-3">
              {filteredIncidents.map(inc => (
                <IncidentCard key={inc.incidentId} incident={inc} user={user} />
              ))}
            </div>
            {/* Cursor pagination controls */}
            <div style={{display: 'flex', gap: '.5rem', alignItems: 'center', marginTop: '0.75rem'}}>
              <button onClick={goPrev} disabled={cursorIndex <= 0} className="nav-button">Anterior</button>
              <div style={{fontSize: '0.9rem'}}>Límite: {limit} • Página aprox.: {cursorIndex + 1}</div>
              <button onClick={goNext} disabled={!nextKey} className="nav-button">Siguiente</button>
              <button onClick={toggleOnlyMine} className={`nav-button ${onlyMine ? 'bg-blue-600 text-white' : ''}`}>{onlyMine ? 'Mostrar todas' : 'Solo mis incidencias'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BodyDashboard
