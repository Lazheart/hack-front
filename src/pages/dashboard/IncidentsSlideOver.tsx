import { useEffect, useState, useCallback } from 'react'
import SlideOver from '../../components/SlideOver'
import IncidentCard from '../../components/incidentCard'
import type { Incident, IncidentDTO } from '../../services/incident/interfaceIncident'
import { getIncidents } from '../../services/incident/incidentApi'
import useAuth from '../../services/auth/useAuth'

export type IncidentsSlideOverProps = {
  open: boolean
  onClose: () => void
  /** Texto inicial para pre-cargar búsqueda local (opcional) */
  initialQuery?: string
}

const IncidentsSlideOver: React.FC<IncidentsSlideOverProps> = ({ open, onClose, initialQuery }) => {
  const { user } = useAuth()

  // All incidents fetched from backend (normal o solo mías) - per page (cursor based)
  const [allIncidents, setAllIncidents] = useState<(Incident | IncidentDTO)[]>([])
  // Incidents después de aplicar búsqueda local
  const [filteredIncidents, setFilteredIncidents] = useState<(Incident | IncidentDTO)[]>([])
  // Texto de búsqueda
  const [searchTerm, setSearchTerm] = useState('')
  // Toggle para pedir solo mis incidencias al backend
  const [onlyMine, setOnlyMine] = useState(false)
  // Estados existentes
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [limit] = useState(10)
  const [cursorIndex, setCursorIndex] = useState(0)
  const [keysStack, setKeysStack] = useState<(string | null)[]>([null])
  const [nextKey, setNextKey] = useState<string | null>(null)

  // Helper para normalizar campos según las dos posibles formas de la respuesta
  const isDTO = (obj: Incident | IncidentDTO): obj is IncidentDTO => {
    return (obj as IncidentDTO).incidentId !== undefined
  }

  const extractFieldsForSearch = useCallback((inc: Incident | IncidentDTO) => {
    if (isDTO(inc)) {
      return {
        incidentId: String(inc.incidentId || ''),
        category: String(inc.category || ''),
        status: String(inc.status || ''),
        createdBy: String(inc.createdBy || ''),
        createdAt: String(inc.createdAt || ''),
      }
    }
    return {
      incidentId: String((inc as Incident).id ?? ''),
      category: String((inc as Incident).categoria ?? ''),
      status: String((inc as Incident).estado ?? ''),
      createdBy: String((inc as Incident).reporter_id ?? ''),
      createdAt: String((inc as Incident).created_at ?? ''),
    }
  }, [])

  // Aplica filtro local en memoria (case-insensitive) sin llamar backend
  const applyLocalFilter = useCallback((baseList: (Incident | IncidentDTO)[], term: string) => {
    const t = term.trim().toLowerCase()
    if (!t) return baseList
    return baseList.filter(inc => {
      const f = extractFieldsForSearch(inc)
      return (
        f.incidentId.toLowerCase().includes(t) ||
        f.category.toLowerCase().includes(t) ||
        f.status.toLowerCase().includes(t) ||
        f.createdBy.toLowerCase().includes(t) ||
        f.createdAt.toLowerCase().includes(t)
      )
    })
  }, [extractFieldsForSearch])

  const load = async (cursor: string | null = null) => {
    setLoading(true)
    setError(null)
    try {
      const res = await getIncidents({ limit, lastKey: cursor, onlyMine })
      const list = (res.items || []) as (Incident | IncidentDTO)[]
      setAllIncidents(list)
      setFilteredIncidents(applyLocalFilter(list, searchTerm))
      setNextKey(res.lastKey ?? null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg || 'Error cargando incidencias')
    } finally {
      setLoading(false)
    }
  }

  // Efecto inicial / apertura
  useEffect(() => {
    if (!open) return
    // Si hay initialQuery la usamos para la búsqueda local inicial
    if (initialQuery) setSearchTerm(initialQuery)
    setCursorIndex(0)
    setKeysStack([null])
    void load(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialQuery, onlyMine])

  // Re-aplicar filtro cuando cambie búsqueda
  useEffect(() => {
    setFilteredIncidents(applyLocalFilter(allIncidents, searchTerm))
  }, [searchTerm, allIncidents, applyLocalFilter])

  // Toggle de sólo mis incidencias: hace request y luego aplica búsqueda vigente
  const toggleOnlyMine = () => {
    setOnlyMine(prev => !prev)
  }

  // Cargar nuevamente cuando cambie onlyMine
  // Cuando cambia onlyMine ya se maneja en efecto anterior (incluido en deps)

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
      {/* Controles de filtrado */}
      <div className="flex flex-col gap-2 mt-2">
        <input
          type="text"
          placeholder="Buscar incidencia (ID, categoría, estado, creador, fecha)"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        />
        <button
          type="button"
          onClick={toggleOnlyMine}
          className={`px-3 py-1 rounded text-sm font-medium border ${onlyMine ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
        >
          {onlyMine ? 'Mostrar todas' : 'Solo mis incidencias'}
        </button>
      </div>

      {loading && <div className="text-sm text-gray-500 mt-2">Cargando incidencias...</div>}
      {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
      {!loading && !error && filteredIncidents.length === 0 && (
        <div className="text-sm text-gray-500 mt-2">No hay incidencias para mostrar.</div>
      )}
      <div className="mt-3" style={{ display: 'grid', gap: '.6rem' }}>
        {filteredIncidents.map((inc) => {
          const key = String(isDTO(inc) ? inc.incidentId : (inc as Incident).id)
          return <IncidentCard key={key} incident={inc} user={user} />
        })}
      </div>
      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', marginTop: '.75rem' }}>
        <button className="nav-button" disabled={cursorIndex <= 0} onClick={() => { const newIdx = Math.max(0, cursorIndex - 1); setCursorIndex(newIdx); void load(keysStack[newIdx]) }}>Anterior</button>
        <div style={{ fontSize: '.9rem' }}>{`Límite ${limit} • Página aprox. ${cursorIndex + 1}`}</div>
        <button className="nav-button" disabled={!nextKey} onClick={() => { if (!nextKey) return; setKeysStack(prev => { const copy = prev.slice(0, cursorIndex + 1); copy.push(nextKey); return copy; }); const newIdx = cursorIndex + 1; setCursorIndex(newIdx); void load(nextKey) }}>Siguiente</button>
      </div>
    </SlideOver>
  )
}

export default IncidentsSlideOver
