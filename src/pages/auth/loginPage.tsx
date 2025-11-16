import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import useAuth from '../../services/auth/useAuth'
import LoginBg from '../../assets/UTEC-Lima_012.webp'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
      await login(email, password)
    navigate(from, { replace: true })
  }

  return (
    <div className="auth-container" style={{backgroundImage: `url(${LoginBg})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="auth-box">
        <div className="auth-card">
          <h1 className="auth-title">Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />

            <button className="auth-button">Entrar</button>
            <p className="auth-small">Si no tienes cuenta, <Link to="/register" style={{color: 'var(--celeste)'}}>regístrate</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
