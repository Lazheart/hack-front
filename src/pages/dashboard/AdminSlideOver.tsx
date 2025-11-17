import SlideOver from '../../components/SlideOver'
import AdminRegisterWorker from './adminRegisterWorker'

export type AdminSlideOverProps = {
  open: boolean
  onClose: () => void
}

const AdminSlideOver: React.FC<AdminSlideOverProps> = ({ open, onClose }) => {
  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={<b>Alta de personal y asignación</b>}
      description="Registra trabajadores y asigna su departamento"
      width={720}
    >
      <AdminRegisterWorker />
    </SlideOver>
  )
}

export default AdminSlideOver
