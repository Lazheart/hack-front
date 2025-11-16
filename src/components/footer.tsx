import { BsGithub } from 'react-icons/bs'
import LogoImage from '../assets/react.svg'

const Footer = () => {
  const collaborators = [
    { href: 'https://github.com/Mystic-W', name: 'Mystic-W' },
    { href: 'https://github.com/Lazheart', name: 'Lazheart' },
    { href: 'https://github.com/araooz', name: 'araooz' },
  ]

  return (
  <footer style={{borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem 0', background: 'var(--bg-black)'}}>
      <div className="footer-inner">
        <div className="footer-left">
          <img className="anim-grow-on-hover" src={LogoImage} alt="logo" style={{height: 44}} />
        </div>

        <div className="footer-center">
          <h3 style={{margin: 0, color: 'var(--text-white)', fontSize: '1.1rem', fontWeight: 700}}>Colaboradores</h3>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.5rem', flexWrap: 'wrap'}}>
            {collaborators.map((c) => (
              <a key={c.href} className="anim-navlink" href={c.href} target="_blank" rel="noreferrer" style={{color: 'var(--text-white)', textDecoration: 'none', display: 'flex', gap: '.5rem', alignItems: 'center'}}>
                <BsGithub />
                <span style={{color: 'var(--celeste)'}}>{c.name}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-right" style={{color: 'rgba(255,255,255,0.85)'}}>
          <a className="anim-navlink" href="https://github.com/Lazheart/cloud-hackaton" target="_blank" rel="noreferrer" style={{color: 'var(--text-white)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '.5rem'}}>
            <BsGithub />
            <span style={{color: 'var(--celeste)'}}>Repositorio</span>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer