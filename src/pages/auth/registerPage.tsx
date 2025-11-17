import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiUser, FiMail, FiEye, FiEyeOff } from 'react-icons/fi'
import useAuth from '../../services/auth/useAuth'
import RegisterBg from '../../assets/Campus-UTEC-web-4.png'

const RegisterPage = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    try {
      setLoading(true)
      // Send proper-cased role and omit department when not set to let API default to "None"
      await register({ username, email, password, role: 'User' })
      navigate('/dashboard', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="auth-container auth-bg-register"
      style={{ backgroundImage: `url(${RegisterBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="auth-overlay" aria-hidden />
      <div className="auth-card-wrapper">
        <div className="auth-card anim-card anim-fade-in">
          <header className="auth-header">
            <div className="auth-icon"><FiUser size={18} /></div>
            <div>
              <h1 className="auth-title">Crear cuenta</h1>
              <p className="auth-subtitle">Únete para reportar y gestionar incidencias</p>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="auth-form auth-stagger">
            <div className="auth-field">
              <FiUser className="field-icon" aria-hidden />
              <input
                id="username"
                type="text"
                placeholder=" "
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="auth-input"
                autoComplete="username"
              />
              <label htmlFor="username" className="auth-label">Nombre de usuario</label>
            </div>

            <div className="auth-field">
              <FiMail className="field-icon" aria-hidden />
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
                autoComplete="new-password"
              />
              <label htmlFor="password" className="auth-label">Contraseña</label>
            </div>

            <button className="auth-button anim-cta" disabled={loading}>
              {loading ? <span className="spinner" aria-hidden /> : 'Crear cuenta'}
            </button>
            <p className="auth-small">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="navlink" style={{ color: 'var(--celeste)' }}>Inicia sesión</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
