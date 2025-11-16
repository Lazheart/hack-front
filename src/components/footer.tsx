import { BsGithub } from 'react-icons/bs'
import LogoImage from '../assets/react.svg'

const Footer = () => {
  const collaborators = [
    { href: 'https://github.com/Mystic-W', name: 'Mystic-W' },
    { href: 'https://github.com/Lazheart', name: 'Lazheart' },
    { href: 'https://github.com/araooz', name: 'araooz' },
  ]

  return (
  <footer style={{borderTop: '1px solid rgba(0,0,0,0.06)', padding: '1.5rem 0', background: 'var(--bg-black)'}}>
      <div className="footer-inner">
        <div className="footer-left">
          <img className="anim-grow-on-hover" src={LogoImage} alt="logo" style={{height: 44}} />
        </div>

        <div className="footer-center">
          <h3 style={{margin: 0, color: 'var(--text-white)', fontSize: '1.1rem', fontWeight: 700}}>Colaboradores</h3>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.5rem', flexWrap: 'wrap'}}>
            {collaborators.map((c) => (
              <a key={c.href} className="collab-link" href={c.href} target="_blank" rel="noreferrer" style={{color: 'var(--text-white)'}}>
                <BsGithub style={{color: 'var(--blue)'}} />
                <span className="collab-name" style={{color: 'var(--celeste)'}}>{c.name}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="footer-right" style={{color: 'var(--text-white)'}}>
          {/* Mostrar solo el icono de GitHub a la derecha, sin texto */}
          <a className="anim-navlink" href="https://github.com/Lazheart/cloud-hackaton" target="_blank" rel="noreferrer" style={{color: 'var(--blue)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center'}} aria-label="Repositorio en GitHub">
            <BsGithub size={20} style={{color: 'var(--blue)'}} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer