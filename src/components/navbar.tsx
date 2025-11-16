import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../services/auth/useAuth'
import { BsSun, BsMoon } from 'react-icons/bs'
import { BiSearch } from 'react-icons/bi'

// Theme toggle: toggles between light (default) and dark by adding a class to document.documentElement
const ThemeToggle = () => {
  const [theme, setTheme] = useState<string>(() => (typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'light') : 'light'))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label="Cambiar tema"
      className="theme-icon"
      title="Cambiar tema"
    >
      {theme === 'light' ? <BsSun size={18} /> : <BsMoon size={18} />}
    </button>
  )
}

// Search form: navigates to /dashboard?q=...&page=1
const SearchForm = () => {
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    params.set('page', '1')
    navigate(`/dashboard?${params.toString()}`)
  }

  return (
    <form onSubmit={onSubmit} style={{display: 'flex', alignItems: 'center', gap: '.4rem'}} className="search-wrapper">
      {/* single integrated search icon (acts as submit) */}
      <button type="submit" aria-label="Buscar" title="Buscar" className="search-icon" style={{background: 'transparent', border: 'none'}}>
        <BiSearch size={18} />
      </button>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..." aria-label="Buscar incidencias" className="search-input" />
    </form>
  )
}

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const headerRef = useRef<HTMLElement | null>(null)
  const lastScrollY = useRef(0)
  const [visible, setVisible] = useState(true)
  const [headerHeight, setHeaderHeight] = useState(0)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    // set header height for spacer to avoid content jump when header is fixed
    const el = headerRef.current
    if (el) setHeaderHeight(el.offsetHeight)

    const handleResize = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    // Hide on scroll down, show on scroll up
    const onScroll = () => {
      const current = window.scrollY
      if (current <= 0) {
        setVisible(true)
        lastScrollY.current = 0
        return
      }

      if (current > lastScrollY.current && current > 80) {
        // scrolled down
        setVisible(false)
      } else if (current < lastScrollY.current) {
        // scrolled up
        setVisible(true)
      }

      lastScrollY.current = current
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const headerStyle: React.CSSProperties = {
    background: 'var(--bg-black)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    transform: visible ? 'translateY(0)' : 'translateY(-110%)',
    transition: 'transform 200ms ease-in-out',
    zIndex: 999,
  }

  const path = location.pathname
  const isAuthPage = path === '/login' || path === '/register'

  return (
    <>
      <header ref={headerRef} style={headerStyle} className="anim-header anim-fade-in">
        <nav style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.5rem', maxWidth: '1200px', margin: '0 auto'}}>
          {/* Left: brand + Dashboard + theme icon (no square) */}
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700}}>
            {/* Ocultar marca en pantallas muy pequeñas para que no se desborde */}
            <a className="text-grow-hover keep-white hide-xs" href="https://hackathon.cs2032.com/" target="_blank" rel="noreferrer" style={{textDecoration: 'none'}}>Hackaton</a>
            <Link to="/" className="text-grow-hover keep-white" style={{textDecoration: 'none', fontWeight: 600}}> Home</Link>
            <Link to="/dashboard" className="text-grow-hover keep-white" style={{textDecoration: 'none', fontWeight: 600}}>Dashboard</Link>
            <ThemeToggle />
          </div>

          {/* Centro: mantiene espacio flex para que los botones sigan a la derecha */}
          <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
            {!isAuthPage && (
              <div style={{width: '100%', maxWidth: 640}}>
                <SearchForm />
              </div>
            )}
          </div>

          {/* Right: auth actions */}
          <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
            {user ? (
              <button onClick={handleLogout} className="anim-cta" style={{background: 'transparent', color: 'var(--text-white)', border: '1px solid rgba(0,0,0,0.06)', padding: '0.5rem 0.8rem', borderRadius: 6}}>Logout</button>
            ) : (
              <>
                {path !== '/login' && (
                  <Link to="/login" className="btn-auth" style={{textDecoration: 'none'}}>Login</Link>
                )}
                {path !== '/register' && (
                  <Link to="/register" className="btn-auth" style={{textDecoration: 'none'}}>Register</Link>
                )}
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Spacer to avoid content being hidden under fixed header */}
      <div style={{height: headerHeight}} aria-hidden />
    </>
  )
}

export default Navbar