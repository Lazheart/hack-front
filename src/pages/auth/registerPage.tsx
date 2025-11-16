import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../../services/auth/useAuth'
import RegisterBg from '../../assets/Campus-UTEC-web-4.png'

const RegisterPage = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Send proper-cased role and omit department when not set to let API default to "None"
    await register({ username, email, password, role: 'User' })
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="auth-container" style={{backgroundImage: `url(${RegisterBg})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="auth-box">
        <div className="auth-card anim-card anim-fade-in">
          <h1 className="auth-title">Crear cuenta</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="auth-input"
            />

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

            <button className="auth-button anim-cta">Crear cuenta</button>
            <p className="auth-small">¿Ya tienes cuenta? <Link to="/login" className="navlink" style={{color: 'var(--celeste)'}}>Inicia sesión</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
