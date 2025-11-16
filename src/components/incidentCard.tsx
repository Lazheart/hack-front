import type { Incident } from '../services/incident/interfaceIncident'
import type { UserInfo } from '../services/auth/interfaceAuth'

type Props = {
	incident: Incident
	user?: UserInfo | null
}

const IncidentCard = ({ incident, user }: Props) => {
	const role = (user?.role || 'User').toString().toLowerCase()

	// fields visibility by role (simple rules):
	// - admin: show everything
	// - user: show minimal fields
	// - default: minimal

	const showAll = role === 'admin'

	return (
		<div className="border rounded-md p-4 mb-3 bg-white shadow-sm">
			<div className="flex justify-between items-start">
				<h3 className="text-lg font-semibold">{incident.titulo}</h3>
				<div className="text-sm text-gray-600">{incident.prioridad || '—'}</div>
			</div>

			<div className="mt-2 text-sm text-gray-700">
				<div>
					<strong>Estado:</strong> {incident.estado ?? '—'}
				</div>

				{showAll && (
					<>
						<div>
							<strong>Reporter:</strong> {String(incident.reporter_id ?? '—')}
						</div>
						<div>
							<strong>Asignado a:</strong> {String(incident.assignee_id ?? '—')}
						</div>
						<div>
							<strong>Categoría:</strong> {incident.categoria ?? '—'}
						</div>
						<div>
							<strong>Creado:</strong> {incident.created_at ?? '—'}
						</div>
						{incident.tags && incident.tags.length > 0 && (
							<div className="mt-2">
								{incident.tags.map(t => (
									<span key={t} className="inline-block bg-gray-100 text-xs mr-1 px-2 py-0.5 rounded">#{t}</span>
								))}
							</div>
						)}
					</>
				)}

				{!showAll && (
					<div className="mt-2 text-gray-600">
						{/* Mostrar descripción corta si existe */}
						{incident.descripcion ? (
							<div className="line-clamp-3" dangerouslySetInnerHTML={{ __html: incident.descripcion }} />
						) : (
							<div className="text-sm">Sin descripción pública</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default IncidentCard

