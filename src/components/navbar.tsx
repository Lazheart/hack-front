import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../services/auth/useAuth'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
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

  return (
    <>
      <header ref={headerRef} style={headerStyle} className="anim-header anim-fade-in">
        <nav style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.5rem', maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{fontWeight: 700}}>
            <Link to="/" className="anim-grow-on-hover" style={{color: 'var(--celeste)', textDecoration: 'none'}}>Hackaton</Link>
          </div>

          <div style={{display: 'flex', gap: '1rem', alignItems: 'center', flex: 1}}>
            <Link to="/" className="anim-navlink" style={{color: 'var(--text-white)', textDecoration: 'none'}}>Home</Link>
            <Link to="/post" className="anim-navlink" style={{color: 'var(--text-white)', textDecoration: 'none'}}>Posts</Link>
          </div>

          <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
            {user ? (
              <button onClick={handleLogout} className="anim-cta" style={{background: 'transparent', color: 'var(--text-white)', border: '1px solid rgba(255,255,255,0.06)', padding: '0.5rem 0.8rem', borderRadius: 6}}>Logout</button>
            ) : (
              <>
                <Link to="/login" className="nav-link" style={{color: 'var(--text-white)', textDecoration: 'none'}}>Login</Link>
                <Link to="/register" className="nav-button" style={{color: 'var(--celeste)', textDecoration: 'none', fontWeight: 700}}>Register</Link>
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