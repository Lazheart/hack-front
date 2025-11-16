// navbar (simple) - no React named imports required with modern JSX transform
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
    <header className="site-navbar">
      <div className="nav-inner">
        <div className="nav-brand">
          <Link to="/" className="brand-link">Waveon</Link>
        </div>

        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/post" className="nav-link">Posts</Link>
          {user ? (
            <button onClick={handleLogout} className="nav-button">Logout</button>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar