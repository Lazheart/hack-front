import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { BsMegaphone, BsShieldCheck, BsLightningCharge, BsGithub } from 'react-icons/bs'
import UtecLogo from '../../assets/UTEC-Logo.jpg'
import C3 from '../../assets/contribuidor1.webp'
import C2 from '../../assets/contribuidor2.webp'
import C1 from '../../assets/contribuidor3.jpeg'

const Feature = ({ icon, title, desc }: { icon: ReactNode, title: string, desc: string }) => (
  <div className="anim-card" style={{background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(16,24,32,0.06)', padding: '1rem', borderRadius: 12}}>
    <div style={{display:'flex', alignItems:'center', gap: '.6rem'}}>
      <div style={{color: 'var(--blue)'}}>{icon}</div>
      <h3 style={{margin: 0}}>{title}</h3>
    </div>
    <p style={{margin: '.5rem 0 0 2.1rem', color:'rgba(11,11,11,0.7)'}}>{desc}</p>
  </div>
)

const Contributor = ({ img, name, href }: { img: string, name: string, href: string }) => (
  <a href={href} target="_blank" rel="noreferrer" className="anim-navlink" style={{textDecoration:'none', color: 'inherit', display:'flex', alignItems:'center', gap: '.6rem'}}>
    <img src={img} alt={name} style={{width: 42, height: 42, objectFit:'cover', borderRadius: '50%', boxShadow:'0 6px 16px rgba(2,6,23,0.18)'}}/>
    <span style={{fontWeight:700}}>{name}</span>
    <BsGithub style={{color: 'var(--blue)'}}/>
  </a>
)

const HomePage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="anim-fade-in" style={{
        background: `linear-gradient(180deg, rgba(126,220,255,0.25), rgba(255,255,255,0.0))`,
        padding: '2.2rem 1rem'
      }}>
        <div style={{maxWidth: 1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1.2fr .8fr', gap:'1.2rem'}}>
          <div style={{display:'flex', flexDirection:'column', gap:'.8rem', justifyContent:'center'}}>
            <h1 style={{margin:0, fontSize:'clamp(1.8rem, 2.8vw, 2.4rem)'}}>Reporta incidentes en UTEC y comunícalos eficientemente</h1>
            <p style={{margin:0, color:'rgba(11,11,11,0.7)'}}>
              Nuestra aplicación permite a estudiantes, docentes y personal registrar incidencias en el campus y seguir su estado hasta su resolución. Simple, rápida y colaborativa.
            </p>
            <div style={{display:'flex', gap:'.6rem', flexWrap:'wrap', marginTop:'.4rem'}}>
              <Link to="/dashboard" className="btn-auth" style={{textDecoration:'none'}}>Ir al Dashboard</Link>
              <Link to="/register" className="nav-ghost" style={{textDecoration:'none'}}>Crear cuenta</Link>
            </div>
          </div>
          <div className="anim-card" style={{background:'#fff', border:'1px solid rgba(16,24,32,0.06)', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:12}}>
            <img src={UtecLogo} alt="UTEC" className="anim-grow-on-hover" style={{width:'70%', maxWidth:300}}/>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{padding:'1.6rem 1rem'}}>
        <div style={{maxWidth:1100, margin:'0 auto', display:'grid', gap:'1rem', gridTemplateColumns:'repeat(3, 1fr)'}}>
          <Feature icon={<BsMegaphone size={22}/>} title="Reporte rápido" desc="Crea incidencias en segundos con texto e imágenes."/>
          <Feature icon={<BsShieldCheck size={22}/>} title="Seguimiento" desc="Estado claro de cada reporte hasta su cierre."/>
          <Feature icon={<BsLightningCharge size={22}/>} title="Notificaciones" desc="Los responsables se enteran a tiempo para actuar."/>
        </div>
      </section>

      {/* Contributors */}
      <section style={{padding:'1rem 1rem 2.2rem'}}>
        <div style={{maxWidth:1100, margin:'0 auto'}}>
          <h2 style={{margin:'0 0 .8rem'}}>Equipo</h2>
          <p style={{margin:'0 0 1rem', color:'rgba(11,11,11,0.7)'}}>Tres colaboradores construimos esta app con cariño para la comunidad UTEC:</p>
          <div style={{display:'flex', gap:'1rem', flexWrap:'wrap'}}>
            <Contributor img={C1} name="Mystic-W" href="https://github.com/Mystic-W"/>
            <Contributor img={C2} name="Lazheart" href="https://github.com/Lazheart"/>
            <Contributor img={C3} name="araooz" href="https://github.com/araooz"/>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px){
          section > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

export default HomePage
