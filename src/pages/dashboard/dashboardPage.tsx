import BodyDashboard from './bodyDashboard'
import { useMemo, useState } from 'react'
import useAuth from '../../services/auth/useAuth'
import { Link } from 'react-router-dom'
import { BsClipboardData, BsPlusSquare, BsPeople } from 'react-icons/bs'
import AdminSlideOver from './AdminSlideOver'
import IncidentsSlideOver from './IncidentsSlideOver'

const DashboardPage = () => {
  const { user } = useAuth()
  const isAdmin = useMemo(() => (user?.role ?? '').toLowerCase() === 'admin', [user])
  const [openIncidents, setOpenIncidents] = useState(false)
  const [openAdmin, setOpenAdmin] = useState(false)

  return (
    <div>
      {/* Hero header */}
      <section className="anim-fade-in" style={{
        background: `linear-gradient(180deg, rgba(126,220,255,0.25), rgba(255,255,255,0.0))`,
        padding: '2rem 1rem'
      }}>
        <div style={{maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1.2fr .8fr', gap:'1.2rem'}}>
          <div style={{display:'flex', flexDirection:'column', gap:'.6rem', justifyContent:'center'}}>
            <h1 style={{margin:0, fontSize:'clamp(1.6rem, 2.6vw, 2.2rem)'}}>Dashboard</h1>
            <p style={{margin:0, color:'rgba(11,11,11,0.7)'}}>
              Bienvenido{user?.username ? `, ${user.username}` : ''}. Rol: <b>{(user?.role ?? 'User')}</b>.
            </p>
            <div style={{display:'flex', gap:'.6rem', flexWrap:'wrap', marginTop:'.4rem'}}>
              <Link to="/post" className="btn-auth" style={{textDecoration:'none'}}>Reportar incidencia</Link>
              <button onClick={() => setOpenIncidents(true)} className="nav-ghost" style={{textDecoration:'none'}}>Ver incidencias</button>
            </div>
          </div>
          <div className="anim-card" style={{background:'#fff', border:'1px solid rgba(16,24,32,0.06)', borderRadius:12, display:'grid', gridTemplateColumns:'repeat(3,1fr)'}}>
            <div style={{padding:'1rem', borderRight:'1px solid rgba(16,24,32,0.06)'}}>
              <div style={{display:'flex', alignItems:'center', gap:'.5rem'}}>
                <BsClipboardData style={{color:'var(--blue)'}}/>
                <b>Incidencias</b>
              </div>
              <div style={{color:'rgba(11,11,11,0.7)'}}>Historial y estado</div>
            </div>
            <div style={{padding:'1rem', borderRight:'1px solid rgba(16,24,32,0.06)'}}>
              <div style={{display:'flex', alignItems:'center', gap:'.5rem'}}>
                <BsPlusSquare style={{color:'var(--blue)'}}/>
                <b>Reportar</b>
              </div>
              <div style={{color:'rgba(11,11,11,0.7)'}}>Crea un nuevo caso</div>
            </div>
            <div style={{padding:'1rem'}}>
              <div style={{display:'flex', alignItems:'center', gap:'.5rem'}}>
                <BsPeople style={{color:'var(--blue)'}}/>
                <b>Equipo</b>
              </div>
              <div style={{color:'rgba(11,11,11,0.7)'}}>Colaboradores y roles</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section style={{padding:'1.2rem 1rem'}}>
        <div style={{maxWidth:1100, margin:'0 auto', display:'grid', gap:'1rem', gridTemplateColumns:'repeat(3, 1fr)'}}>
          <button onClick={() => setOpenIncidents(true)} className="anim-card" style={{textDecoration:'none', color:'inherit', background:'#fff', border:'1px solid rgba(16,24,32,0.06)', padding:'1rem', textAlign:'left'}}>
            <div style={{display:'flex', alignItems:'center', gap:'.6rem'}}>
              <BsClipboardData style={{color:'var(--blue)'}}/>
              <b>Ver incidencias</b>
            </div>
            <div style={{color:'rgba(11,11,11,0.7)', marginTop:'.25rem'}}>Explora reportes y su progreso.</div>
          </button>

          <Link to="/post" className="anim-card" style={{textDecoration:'none', color:'inherit', background:'#fff', border:'1px solid rgba(16,24,32,0.06)', padding:'1rem'}}>
            <div style={{display:'flex', alignItems:'center', gap:'.6rem'}}>
              <BsPlusSquare style={{color:'var(--blue)'}}/>
              <b>Reportar nuevo</b>
            </div>
            <div style={{color:'rgba(11,11,11,0.7)', marginTop:'.25rem'}}>Crea una incidencia en segundos.</div>
          </Link>

          {isAdmin ? (
            <button onClick={() => setOpenAdmin(true)} className="anim-card" style={{textDecoration:'none', color:'inherit', background:'#fff', border:'1px solid rgba(16,24,32,0.06)', padding:'1rem', textAlign:'left'}}>
              <div style={{display:'flex', alignItems:'center', gap:'.6rem'}}>
                <BsPeople style={{color:'var(--blue)'}}/>
                <b>Registrar trabajador</b>
              </div>
              <div style={{color:'rgba(11,11,11,0.7)', marginTop:'.25rem'}}>Alta de personal y asignación.</div>
            </button>
          ) : (
            <div className="anim-card" style={{background:'#fff', border:'1px solid rgba(16,24,32,0.06)', padding:'1rem', opacity:0.7}}>
              <div style={{display:'flex', alignItems:'center', gap:'.6rem'}}>
                <BsPeople style={{color:'var(--blue)'}}/>
                <b>Equipo</b>
              </div>
              <div style={{color:'rgba(11,11,11,0.7)', marginTop:'.25rem'}}>Contacta con tu administrador.</div>
            </div>
          )}
        </div>
      </section>

      {/* SlideOver modals */}
      <IncidentsSlideOver open={openIncidents} onClose={() => setOpenIncidents(false)} />
      {isAdmin && <AdminSlideOver open={openAdmin} onClose={() => setOpenAdmin(false)} />}

      {/* Incidents panel */}
      <section style={{padding:'1rem'}}>
        <div style={{maxWidth:1100, margin:'0 auto'}}>
          <BodyDashboard />
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
