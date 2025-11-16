import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../services/auth/useAuth'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header style={{background: 'var(--bg-black)', borderBottom: '1px solid rgba(255,255,255,0.06)'}}>
      <nav style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.5rem', maxWidth: '1200px', margin: '0 auto'}}>
        <div style={{fontWeight: 700}}>
          <Link to="/" style={{color: 'var(--celeste)', textDecoration: 'none'}}>Waveon</Link>
        </div>

        <div style={{display: 'flex', gap: '1rem', alignItems: 'center', flex: 1}}>
          <Link to="/" style={{color: 'var(--text-white)', textDecoration: 'none'}}>Home</Link>
          <Link to="/post" style={{color: 'var(--text-white)', textDecoration: 'none'}}>Posts</Link>
        </div>

        <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
          {user ? (
            <button onClick={handleLogout} style={{background: 'transparent', color: 'var(--text-white)', border: '1px solid rgba(255,255,255,0.06)', padding: '0.5rem 0.8rem', borderRadius: 6}}>Logout</button>
          ) : (
            <>
              <Link to="/login" style={{color: 'var(--text-white)', textDecoration: 'none'}}>Login</Link>
              <Link to="/register" style={{color: 'var(--celeste)', textDecoration: 'none', fontWeight: 700}}>Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar