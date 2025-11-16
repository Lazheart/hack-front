import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../../services/auth/useAuth'

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
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border rounded"
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
          <p className="auth-small">Si no tienes cuenta, regístrate en /register</p>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
