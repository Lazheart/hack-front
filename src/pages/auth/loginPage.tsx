import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import useAuth from '../../services/auth/useAuth'
import LoginBg from '../../assets/UTEC-Lima_012.webp'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    try {
      setLoading(true)
      await login(email, password)
      navigate(from, { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="auth-container auth-bg-login"
      style={{ backgroundImage: `url(${LoginBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="auth-overlay" aria-hidden />
      <div className="auth-card-wrapper">
        <div className="auth-card anim-card anim-fade-in">
          <header className="auth-header">
            <div className="auth-icon"><FiUser size={18} /></div>
            <div>
              <h1 className="auth-title">Inicia sesión</h1>
              <p className="auth-subtitle">Accede a tu cuenta para continuar</p>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="auth-form auth-stagger">
            <div className="auth-field">
              {/* Persona en lugar de sobre/candado para el primer campo */}
              <FiUser className="field-icon" aria-hidden />
              <input
                id="email"
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
                autoComplete="email"
              />
              <label htmlFor="email" className="auth-label">Correo electrónico</label>
            </div>

            <div className="auth-field">
              <FiLock className="field-icon" aria-hidden />
              <button
                type="button"
                className="field-append"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
                autoComplete="current-password"
              />
              <label htmlFor="password" className="auth-label">Contraseña</label>
            </div>

            <button className="auth-button anim-cta" disabled={loading}>
              {loading ? <span className="spinner" aria-hidden /> : 'Entrar'}
            </button>
            <p className="auth-small">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="navlink" style={{ color: 'var(--celeste)' }}>Regístrate</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
