import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePlayer } from '../context/PlayerContext'
import { useTheme } from '../context/ThemeContext'
import { useCart } from '../context/CartContext'
import Footer from './Footer'

function AppShell({ children }) {
  const { user, logout } = useAuth()
  const { currentTrack, isPlaying, progress, duration, pause, resume, stop, seek } = usePlayer()
  const { theme, toggleTheme } = useTheme()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const isHome = location.pathname === '/'

  return (
    <div className="app-shell">
      <header className={`app-header ${isHome ? 'header-transparent' : ''}`}>
        <div className="header-inner">
          <NavLink to="/" className="logo">
            <span className="logo-icon">🎧</span>
            <span className="logo-text">AudioBooks</span>
          </NavLink>
          <nav className="main-nav">
            <NavLink to="/catalog" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <span>Catalog</span>
            </NavLink>

            <NavLink to="/podcasts" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/></svg>
              <span>Podcasts</span>
            </NavLink>
            <NavLink to="/forum" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              <span>Forum</span>
            </NavLink>
          </nav>
          <div className="header-actions">
            {/* Theme toggle */}
            <button className="icon-btn" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              )}
            </button>
            {/* Cart with badge */}
            <NavLink to="/cart" className="icon-btn" title="Cart" style={{ position: 'relative' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount > 9 ? '9+' : cartCount}</span>
              )}
            </NavLink>
            {user ? (
              <>
                <NavLink to="/notifications" className="icon-btn" title="Notifications">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                </NavLink>
                <NavLink to="/profile" className="user-btn">
                  <span className="user-avatar">{user.display_name?.[0]?.toUpperCase()}</span>
                  <span className="user-name">{user.display_name}</span>
                </NavLink>
                <button className="btn btn-ghost" onClick={() => { logout(); navigate('/'); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-ghost">Log In</NavLink>
                <NavLink to="/signup" className="btn btn-glow">Sign Up</NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main className={`app-main ${isHome ? 'main-full' : ''}`}>
        {children}
      </main>

      <Footer />

      {currentTrack && (
        <div className="player-bar">
          <div
            className="player-progress-top"
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const pct = (e.clientX - rect.left) / rect.width
              const seekTo = pct * (duration || currentTrack.duration_seconds || 0)
              seek(seekTo)
            }}
          >
            <div className="progress" style={{ width: duration ? `${(progress / duration) * 100}%` : '0%' }}></div>
          </div>
          <div className="player-inner">
            <div className="player-info">
              <div className="player-artwork">
                <span>🎵</span>
              </div>
              <div className="player-text">
                <div className="title">{currentTrack.title}</div>
                <div className="artist">{currentTrack.artist || currentTrack.author}</div>
              </div>
            </div>
            <div className="player-controls">
              <button className="player-btn" onClick={isPlaying ? pause : resume}>
                {isPlaying ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                )}
              </button>
              <button className="player-btn player-btn-sm" onClick={stop}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
              </button>
            </div>
            <div className="player-time">
              <span>{formatTime(progress)} / {formatTime(duration || currentTrack.duration_seconds || 0)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppShell
