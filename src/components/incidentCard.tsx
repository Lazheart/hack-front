import type { Incident, IncidentDTO } from '../services/incident/interfaceIncident'
import type { UserInfo } from '../services/auth/interfaceAuth'

type Props = {
	incident: Incident | IncidentDTO
	user?: UserInfo | null
}

const IncidentCard = ({ incident, user }: Props) => {
	const role = (user?.role || 'User').toString().toLowerCase()

	// fields visibility by role (simple rules):
	// - admin: show everything
	// - user: show minimal fields
	// - default: minimal

	const showAll = role === 'admin'

	// Normalize fields to support legacy Incident and new IncidentDTO
	const isDTO = (incident as IncidentDTO).incidentId !== undefined
	const title = isDTO
		? `[#${(incident as IncidentDTO).incidentId}] ${(incident as IncidentDTO).category}`
		: (incident as Incident).titulo
	const prioridad = isDTO ? (incident as IncidentDTO).urgency : (incident as Incident).prioridad
	const estado = isDTO ? (incident as IncidentDTO).status : (incident as Incident).estado
	const reporter = isDTO ? (incident as IncidentDTO).createdBy : String((incident as Incident).reporter_id ?? '—')
	const assignee = isDTO ? (incident as IncidentDTO).solvedBy : String((incident as Incident).assignee_id ?? '—')
	const categoria = isDTO ? (incident as IncidentDTO).category : (incident as Incident).categoria
	const creado = isDTO ? (incident as IncidentDTO).createdAt : (incident as Incident).created_at

	return (
		<div className="border rounded-md p-4 mb-3 bg-white shadow-sm">
			<div className="flex justify-between items-start">
				<h3 className="text-lg font-semibold">{title}</h3>
				<div className="text-sm text-gray-600">{prioridad || '—'}</div>
			</div>

			<div className="mt-2 text-sm text-gray-700">
				<div>
					<strong>Estado:</strong> {estado ?? '—'}
				</div>

				{showAll && (
					<>
						<div>
							<strong>Reporter:</strong> {reporter}
						</div>
						<div>
							<strong>Asignado a:</strong> {assignee ?? '—'}
						</div>
						<div>
							<strong>Categoría:</strong> {categoria ?? '—'}
						</div>
						<div>
							<strong>Creado:</strong> {creado ?? '—'}
						</div>
						{!isDTO && (incident as Incident).tags && (incident as Incident).tags!.length > 0 && (
							<div className="mt-2">
								{(incident as Incident).tags!.map(t => (
									<span key={t} className="inline-block bg-gray-100 text-xs mr-1 px-2 py-0.5 rounded">#{t}</span>
								))}
							</div>
						)}
					</>
				)}

				{!showAll && (
					<div className="mt-2 text-gray-600">
						{/* Mostrar descripción corta si existe */}
						{!isDTO && (incident as Incident).descripcion ? (
							<div className="line-clamp-3" dangerouslySetInnerHTML={{ __html: (incident as Incident).descripcion! }} />
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

